const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

const PORT = process.env.PORT || 5000;
const TMDB_API_KEY = process.env.TMDB_API_KEY || '6497f9649efc88cff5d4708194da4269';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const WEB_DIR = path.join(__dirname, '..', 'web');
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// User accounts and multi-profile storage helpers
function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const content = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(content || '{}');
    }
  } catch (err) {
    console.warn('Error reading users.json:', err.message);
  }
  return {};
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving users.json:', err.message);
  }
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, storedHash) {
  try {
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
  } catch (e) {
    return false;
  }
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function getAuthToken(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return req.headers['x-auth-token'] || '';
}

function getUserByToken(token) {
  if (!token) return null;
  const users = loadUsers();
  for (const userId of Object.keys(users)) {
    const user = users[userId];
    if (user.sessions && user.sessions.includes(token)) {
      return { user, users };
    }
  }
  return null;
}

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
    profiles: (user.profiles || []).map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      isKids: !!p.isKids,
      watchlistCount: (p.watchlist || []).length,
      historyCount: (p.history || []).length
    }))
  };
}

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 2 * 1024 * 1024) { // 2MB limit
        req.destroy();
        reject(new Error('Request entity too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

// Simple in-memory cache to reduce TMDB rate limits and speed up responses
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCached(key, data) {
  // Cap cache size
  if (cache.size > 500) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, { timestamp: Date.now(), data });
}

// Fallback catalog in case TMDB is offline or network is isolated
const FALLBACK_CATALOG = {
  trending: [
    {
      id: 533535,
      title: 'Deadpool & Wolverine',
      name: 'Deadpool & Wolverine',
      media_type: 'movie',
      genre_ids: [28, 35, 878],
      poster_path: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
      backdrop_path: '/yD38bO7a5gq4J5L4H6Y7p1GqZ0u.jpg',
      vote_average: 7.7,
      release_date: '2024-07-24',
      overview: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.'
    },
    {
      id: 693134,
      title: 'Dune: Part Two',
      name: 'Dune: Part Two',
      media_type: 'movie',
      genre_ids: [878, 12, 18],
      poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s520Hgq.jpg',
      vote_average: 8.2,
      release_date: '2024-02-27',
      overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.'
    },
    {
      id: 1022789,
      title: 'Inside Out 2',
      name: 'Inside Out 2',
      media_type: 'movie',
      genre_ids: [16, 10751, 35],
      poster_path: '/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
      backdrop_path: '/p5ozvmdgsmbWe0H8hkfq4D9mu4P.jpg',
      vote_average: 7.6,
      release_date: '2024-06-11',
      overview: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions!"
    },
    {
      id: 569094,
      title: 'Spider-Man: Across the Spider-Verse',
      name: 'Spider-Man: Across the Spider-Verse',
      media_type: 'movie',
      genre_ids: [16, 28, 12, 878],
      poster_path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
      backdrop_path: '/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
      vote_average: 8.4,
      release_date: '2023-05-31',
      overview: 'After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse.'
    },
    {
      id: 157336,
      title: 'Interstellar',
      name: 'Interstellar',
      media_type: 'movie',
      genre_ids: [12, 18, 878],
      poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      backdrop_path: '/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
      vote_average: 8.4,
      release_date: '2014-11-05',
      overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.'
    },
    {
      id: 872585,
      title: 'Oppenheimer',
      name: 'Oppenheimer',
      media_type: 'movie',
      genre_ids: [18, 36],
      poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      backdrop_path: '/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg',
      vote_average: 8.1,
      release_date: '2023-07-19',
      overview: 'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II.'
    },
    {
      id: 155,
      title: 'The Dark Knight',
      name: 'The Dark Knight',
      media_type: 'movie',
      genre_ids: [18, 28, 80],
      poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      backdrop_path: '/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
      vote_average: 8.5,
      release_date: '2008-07-16',
      overview: 'Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.'
    },
    {
      id: 27205,
      title: 'Inception',
      name: 'Inception',
      media_type: 'movie',
      genre_ids: [28, 878, 12],
      poster_path: '/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
      backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
      vote_average: 8.4,
      release_date: '2010-07-15',
      overview: 'Cobb, a skilled thief who steals corporate secrets through the use of dream-sharing technology.'
    },
    {
      id: 94605,
      title: 'Arcane',
      name: 'Arcane',
      media_type: 'tv',
      genre_ids: [16, 10765, 18],
      poster_path: '/abf8tHg9muGSpCHEvAvjFp21duO.jpg',
      backdrop_path: '/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg',
      vote_average: 8.7,
      first_air_date: '2021-11-06',
      overview: 'Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and incompatible convictions.'
    },
    {
      id: 76479,
      title: 'The Boys',
      name: 'The Boys',
      media_type: 'tv',
      genre_ids: [10765, 28],
      poster_path: '/2zm7H4nTh0qRI6Aj44r1i9Y497q.jpg',
      backdrop_path: '/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg',
      vote_average: 8.4,
      first_air_date: '2019-07-26',
      overview: 'A fun and irreverent take on what happens when superheroes abuse their superpowers rather than use them for good.'
    },
    {
      id: 66732,
      title: 'Stranger Things',
      name: 'Stranger Things',
      media_type: 'tv',
      genre_ids: [18, 10765, 9648],
      poster_path: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
      backdrop_path: '/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
      vote_average: 8.6,
      first_air_date: '2016-07-15',
      overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.'
    },
    {
      id: 1396,
      title: 'Breaking Bad',
      name: 'Breaking Bad',
      media_type: 'tv',
      genre_ids: [18, 80],
      poster_path: '/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
      backdrop_path: '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
      vote_average: 8.9,
      first_air_date: '2008-01-20',
      overview: 'Walter White, a New Mexico chemistry teacher, learns he has terminal lung cancer and turns to manufacturing methamphetamine.'
    }
  ]
};

// Safe JSON parser helper
function sendJSON(res, statusCode, data) {
  const payload = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Auth-Token, Range',
    'Cache-Control': 'no-cache'
  });
  res.end(payload);
}

// Fetch helper from TMDB
function fetchTMDB(endpoint, queryParams = {}) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'en-US',
      ...queryParams
    });
    const requestUrl = `${TMDB_BASE_URL}${endpoint}?${params.toString()}`;

    const cached = getCached(requestUrl);
    if (cached) {
      return resolve(cached);
    }

    const options = {
      timeout: 8000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    const req = https.get(requestUrl, options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const parsed = JSON.parse(body);
            setCached(requestUrl, parsed);
            resolve(parsed);
          } else {
            reject(new Error(`TMDB HTTP ${res.statusCode}: ${body}`));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('TMDB request timeout'));
    });
  });
}

// Streaming URL generator
function getMovieStreamSources(id) {
  return {
    id: String(id),
    type: 'movie',
    servers: [
      { name: 'VidSrc (Fast)', url: `https://vidsrc.to/embed/movie/${id}`, quality: '1080p', speed: 'Fast' },
      { name: 'Embed.su', url: `https://embed.su/embed/movie/${id}`, quality: '1080p', speed: 'Ultra' },
      { name: 'VidSrc.xyz', url: `https://vidsrc.xyz/embed/movie/${id}`, quality: 'HD', speed: 'Standard' },
      { name: 'SuperEmbed', url: `https://multiembed.mov/?video_id=${id}&tmdb=1`, quality: '1080p', speed: 'Fast' },
      { name: '2Embed', url: `https://www.2embed.cc/embed/${id}`, quality: 'HD', speed: 'Standard' },
      { name: 'VidLink', url: `https://vidlink.pro/movie/${id}`, quality: '1080p', speed: 'Fast' },
      { name: 'AutoEmbed', url: `https://player.autoembed.cc/embed/movie/${id}`, quality: '1080p', speed: 'Fast' }
    ]
  };
}

function getTvStreamSources(id, season, episode) {
  const s = parseInt(season, 10) || 1;
  const e = parseInt(episode, 10) || 1;

  return {
    id: String(id),
    type: 'tv',
    season: s,
    episode: e,
    servers: [
      { name: 'VidSrc (Fast)', url: `https://vidsrc.to/embed/tv/${id}/${s}/${e}`, quality: '1080p', speed: 'Fast' },
      { name: 'Embed.su', url: `https://embed.su/embed/tv/${id}/${s}/${e}`, quality: '1080p', speed: 'Ultra' },
      { name: 'VidSrc.xyz', url: `https://vidsrc.xyz/embed/tv/${id}/${s}-${e}`, quality: 'HD', speed: 'Standard' },
      { name: 'SuperEmbed', url: `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`, quality: '1080p', speed: 'Fast' },
      { name: '2Embed', url: `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`, quality: 'HD', speed: 'Standard' },
      { name: 'VidLink', url: `https://vidlink.pro/tv/${id}/${s}/${e}`, quality: '1080p', speed: 'Fast' },
      { name: 'AutoEmbed', url: `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}`, quality: '1080p', speed: 'Fast' }
    ]
  };
}

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

// Static file handler
function serveStaticFile(req, res, pathname) {
  // If an API route fell through, return 404 JSON instead of HTML
  if (pathname.startsWith('/api/')) {
    return sendJSON(res, 404, { error: `API route not found: ${pathname}` });
  }

  let relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = path.normalize(path.join(WEB_DIR, relativePath));

  // Security check: ensure path is within WEB_DIR
  if (!filePath.startsWith(WEB_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If file not found, try index.html for SPA-like navigation or return 404
      const fallbackPath = path.join(WEB_DIR, 'index.html');
      fs.readFile(fallbackPath, (fbErr, content) => {
        if (fbErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Development & active update friendly: do not cache HTML, JS, or CSS
    const isDynamicAsset = ext === '.html' || ext === '.js' || ext === '.css';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': isDynamicAsset ? 'no-cache, no-store, must-revalidate' : 'public, max-age=86400',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
}

// Main HTTP Request Handler
async function handleRequest(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Auth-Token, Range'
    });
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // ==========================================
  // AUTH & MULTI-PROFILE ENDPOINTS (Netflix style)
  // ==========================================

  // A. Register Account
  if (req.method === 'POST' && pathname === '/api/auth/register') {
    try {
      const body = await parseRequestBody(req);
      const email = (body.email || '').trim().toLowerCase();
      const username = (body.username || '').trim();
      const password = body.password || '';

      if (!email || !email.includes('@')) {
        return sendJSON(res, 400, { error: 'A valid email address is required.' });
      }
      if (!username || username.length < 3 || username.length > 20) {
        return sendJSON(res, 400, { error: 'Username must be between 3 and 20 characters.' });
      }
      if (!password || password.length < 4) {
        return sendJSON(res, 400, { error: 'Password must be at least 4 characters.' });
      }

      const users = loadUsers();
      for (const uid of Object.keys(users)) {
        if (users[uid].email.toLowerCase() === email) {
          return sendJSON(res, 400, { error: 'An account with this email already exists.' });
        }
        if (users[uid].username.toLowerCase() === username.toLowerCase()) {
          return sendJSON(res, 400, { error: 'This username is already taken.' });
        }
      }

      const { salt, hash } = hashPassword(password);
      const userId = 'usr_' + crypto.randomBytes(8).toString('hex');
      const token = generateToken();

      const defaultProfile = {
        id: 'prof_' + crypto.randomBytes(6).toString('hex'),
        name: username,
        avatar: 'avatar-red',
        isKids: false,
        watchlist: [],
        history: []
      };

      const newUser = {
        id: userId,
        email,
        username,
        salt,
        hash,
        createdAt: Date.now(),
        sessions: [token],
        profiles: [defaultProfile]
      };

      users[userId] = newUser;
      saveUsers(users);

      return sendJSON(res, 201, {
        token,
        user: sanitizeUser(newUser),
        activeProfile: defaultProfile
      });
    } catch (err) {
      return sendJSON(res, 400, { error: err.message || 'Registration failed' });
    }
  }

  // B. Login Account
  if (req.method === 'POST' && pathname === '/api/auth/login') {
    try {
      const body = await parseRequestBody(req);
      const emailOrUsername = (body.emailOrUsername || '').trim().toLowerCase();
      const password = body.password || '';

      if (!emailOrUsername || !password) {
        return sendJSON(res, 400, { error: 'Please enter your email/username and password.' });
      }

      const users = loadUsers();
      let matchedUser = null;

      for (const uid of Object.keys(users)) {
        const u = users[uid];
        if (u.email.toLowerCase() === emailOrUsername || u.username.toLowerCase() === emailOrUsername) {
          matchedUser = u;
          break;
        }
      }

      if (!matchedUser || !verifyPassword(password, matchedUser.salt, matchedUser.hash)) {
        return sendJSON(res, 401, { error: 'Invalid credentials. Please check your password.' });
      }

      const token = generateToken();
      if (!matchedUser.sessions) matchedUser.sessions = [];
      matchedUser.sessions.push(token);
      if (matchedUser.sessions.length > 10) matchedUser.sessions.shift();

      saveUsers(users);

      return sendJSON(res, 200, {
        token,
        user: sanitizeUser(matchedUser),
        activeProfile: matchedUser.profiles[0] || null
      });
    } catch (err) {
      return sendJSON(res, 400, { error: err.message || 'Login failed' });
    }
  }

  // C. Get Current User & Profiles
  if (req.method === 'GET' && pathname === '/api/auth/me') {
    const authData = getUserByToken(getAuthToken(req));
    if (!authData) {
      return sendJSON(res, 401, { error: 'Unauthorized session' });
    }
    return sendJSON(res, 200, { user: sanitizeUser(authData.user) });
  }

  // D. Logout
  if (req.method === 'POST' && pathname === '/api/auth/logout') {
    const token = getAuthToken(req);
    const authData = getUserByToken(token);
    if (authData) {
      authData.user.sessions = (authData.user.sessions || []).filter(s => s !== token);
      saveUsers(authData.users);
    }
    return sendJSON(res, 200, { success: true });
  }

  // E. Create New Profile (Netflix "Who's Watching?")
  if (req.method === 'POST' && pathname === '/api/profiles/create') {
    const authData = getUserByToken(getAuthToken(req));
    if (!authData) {
      return sendJSON(res, 401, { error: 'Please sign in to manage profiles' });
    }

    const { user, users } = authData;
    if (user.profiles && user.profiles.length >= 10) {
      return sendJSON(res, 400, { error: 'Maximum 10 profiles allowed per account.' });
    }

    try {
      const body = await parseRequestBody(req);
      const name = (body.name || '').trim().slice(0, 20);
      if (!name) {
        return sendJSON(res, 400, { error: 'Profile name is required' });
      }

      const defaultAvatars = ['avatar-red', 'avatar-blue', 'avatar-yellow', 'avatar-green', 'avatar-purple', 'avatar-pink', 'avatar-teal', 'avatar-kids'];
      const avatar = (typeof body.avatar === 'string' && body.avatar.trim()) ? body.avatar.trim().slice(0, 40) : defaultAvatars[user.profiles.length % defaultAvatars.length];
      const isKids = Boolean(body.isKids);

      const newProfile = {
        id: 'prof_' + crypto.randomBytes(6).toString('hex'),
        name,
        avatar,
        isKids,
        watchlist: [],
        history: []
      };

      if (!user.profiles) user.profiles = [];
      user.profiles.push(newProfile);
      saveUsers(users);

      return sendJSON(res, 201, {
        user: sanitizeUser(user),
        profile: newProfile
      });
    } catch (err) {
      return sendJSON(res, 400, { error: err.message || 'Failed to create profile' });
    }
  }

  // F. Update Existing Profile
  if (req.method === 'PUT' && pathname === '/api/profiles/update') {
    const authData = getUserByToken(getAuthToken(req));
    if (!authData) {
      return sendJSON(res, 401, { error: 'Unauthorized' });
    }

    const { user, users } = authData;
    try {
      const body = await parseRequestBody(req);
      const profile = (user.profiles || []).find(p => p.id === body.profileId);
      if (!profile) {
        return sendJSON(res, 404, { error: 'Profile not found' });
      }

      if (body.name && body.name.trim()) {
        profile.name = body.name.trim().slice(0, 20);
      }
      if (body.avatar) {
        profile.avatar = body.avatar;
      }
      if (typeof body.isKids === 'boolean') {
        profile.isKids = body.isKids;
      }

      saveUsers(users);
      return sendJSON(res, 200, {
        user: sanitizeUser(user),
        profile
      });
    } catch (err) {
      return sendJSON(res, 400, { error: err.message || 'Failed to update profile' });
    }
  }

  // G. Delete Profile
  const deleteProfileMatch = pathname.match(/^\/api\/profiles\/(prof_[a-zA-Z0-9]+)$/);
  if (req.method === 'DELETE' && deleteProfileMatch) {
    const authData = getUserByToken(getAuthToken(req));
    if (!authData) {
      return sendJSON(res, 401, { error: 'Unauthorized' });
    }

    const profileId = deleteProfileMatch[1];
    const { user, users } = authData;

    if (!user.profiles || user.profiles.length <= 1) {
      return sendJSON(res, 400, { error: 'You must have at least one profile on your account.' });
    }

    const idx = user.profiles.findIndex(p => p.id === profileId);
    if (idx === -1) {
      return sendJSON(res, 404, { error: 'Profile not found' });
    }

    user.profiles.splice(idx, 1);
    saveUsers(users);

    return sendJSON(res, 200, { user: sanitizeUser(user) });
  }

  // H. Get Profile Data (Watchlist & History)
  const profileDataMatch = pathname.match(/^\/api\/profiles\/(prof_[a-zA-Z0-9]+)\/data$/);
  if (req.method === 'GET' && profileDataMatch) {
    const authData = getUserByToken(getAuthToken(req));
    if (!authData) {
      return sendJSON(res, 401, { error: 'Unauthorized' });
    }

    const profileId = profileDataMatch[1];
    const profile = (authData.user.profiles || []).find(p => p.id === profileId);
    if (!profile) {
      return sendJSON(res, 404, { error: 'Profile not found' });
    }

    return sendJSON(res, 200, {
      profileId,
      watchlist: profile.watchlist || [],
      history: profile.history || []
    });
  }

  // I. Profile Watchlist Toggle / Add / Remove
  const profileWatchlistMatch = pathname.match(/^\/api\/profiles\/(prof_[a-zA-Z0-9]+)\/watchlist$/);
  if (req.method === 'POST' && profileWatchlistMatch) {
    const authData = getUserByToken(getAuthToken(req));
    if (!authData) {
      return sendJSON(res, 401, { error: 'Unauthorized' });
    }

    const profileId = profileWatchlistMatch[1];
    const { user, users } = authData;
    const profile = (user.profiles || []).find(p => p.id === profileId);
    if (!profile) {
      return sendJSON(res, 404, { error: 'Profile not found' });
    }

    try {
      const body = await parseRequestBody(req);
      const media = body.media;
      if (!media || !media.id) {
        return sendJSON(res, 400, { error: 'Media payload required' });
      }

      if (!profile.watchlist) profile.watchlist = [];

      const existsIdx = profile.watchlist.findIndex(m => String(m.id) === String(media.id));
      if (existsIdx >= 0) {
        profile.watchlist.splice(existsIdx, 1);
      } else {
        profile.watchlist.unshift({
          id: media.id,
          title: media.title || media.name,
          name: media.name || media.title,
          media_type: media.media_type || (media.first_air_date ? 'tv' : 'movie'),
          poster_path: media.poster_path,
          backdrop_path: media.backdrop_path,
          vote_average: media.vote_average,
          release_date: media.release_date || media.first_air_date,
          first_air_date: media.first_air_date || media.release_date,
          overview: media.overview,
          addedAt: Date.now()
        });
      }

      saveUsers(users);
      return sendJSON(res, 200, {
        watchlist: profile.watchlist,
        inWatchlist: existsIdx === -1
      });
    } catch (err) {
      return sendJSON(res, 400, { error: err.message || 'Failed to update watchlist' });
    }
  }

  // J. Profile Watch History Record (Continue Watching)
  const profileHistoryMatch = pathname.match(/^\/api\/profiles\/(prof_[a-zA-Z0-9]+)\/history$/);
  if (req.method === 'POST' && profileHistoryMatch) {
    const authData = getUserByToken(getAuthToken(req));
    if (!authData) {
      return sendJSON(res, 401, { error: 'Unauthorized' });
    }

    const profileId = profileHistoryMatch[1];
    const { user, users } = authData;
    const profile = (user.profiles || []).find(p => p.id === profileId);
    if (!profile) {
      return sendJSON(res, 404, { error: 'Profile not found' });
    }

    try {
      const body = await parseRequestBody(req);
      const media = body.media;
      if (!media || !media.id) {
        return sendJSON(res, 400, { error: 'Media payload required' });
      }

      if (!profile.history) profile.history = [];

      // Deduplicate history
      profile.history = profile.history.filter(h => String(h.id) !== String(media.id));
      profile.history.unshift({
        id: media.id,
        title: media.title || media.name,
        name: media.name || media.title,
        media_type: media.media_type || (media.first_air_date ? 'tv' : 'movie'),
        poster_path: media.poster_path,
        backdrop_path: media.backdrop_path,
        vote_average: media.vote_average,
        season: body.season || 1,
        episode: body.episode || 1,
        watchedAt: Date.now()
      });

      // Keep top 40 history items
      if (profile.history.length > 40) {
        profile.history = profile.history.slice(0, 40);
      }

      saveUsers(users);
      return sendJSON(res, 200, { history: profile.history });
    } catch (err) {
      return sendJSON(res, 400, { error: err.message || 'Failed to update history' });
    }
  }

  // 1. API: /api/trending
  if (pathname === '/api/trending') {
    const page = query.page || '1';
    try {
      const data = await fetchTMDB('/trending/all/day', { page });
      return sendJSON(res, 200, data);
    } catch (err) {
      console.warn('[TMDB Proxy] Falling back for /api/trending:', err.message);
      return sendJSON(res, 200, {
        page: 1,
        results: FALLBACK_CATALOG.trending,
        total_pages: 1,
        total_results: FALLBACK_CATALOG.trending.length,
        is_fallback: true
      });
    }
  }

  // 2. API: /api/movies
  if (pathname === '/api/movies') {
    const page = query.page || '1';
    try {
      const data = await fetchTMDB('/movie/popular', { page });
      if (data && Array.isArray(data.results)) {
        data.results = data.results.map(item => ({ ...item, media_type: 'movie' }));
      }
      return sendJSON(res, 200, data);
    } catch (err) {
      console.warn('[TMDB Proxy] Falling back for /api/movies:', err.message);
      const movies = (FALLBACK_CATALOG.movies || FALLBACK_CATALOG.trending.filter(item => item.media_type === 'movie')).map(m => ({ ...m, media_type: 'movie' }));
      return sendJSON(res, 200, {
        page: 1,
        results: movies,
        total_pages: 1,
        total_results: movies.length,
        is_fallback: true
      });
    }
  }

  // 3. API: /api/tv
  if (pathname === '/api/tv') {
    const page = query.page || '1';
    try {
      const data = await fetchTMDB('/tv/popular', { page });
      if (data && Array.isArray(data.results)) {
        data.results = data.results.map(item => ({ ...item, media_type: 'tv' }));
      }
      return sendJSON(res, 200, data);
    } catch (err) {
      console.warn('[TMDB Proxy] Falling back for /api/tv:', err.message);
      const tvShows = (FALLBACK_CATALOG.tv || FALLBACK_CATALOG.trending.filter(item => item.media_type === 'tv')).map(t => ({ ...t, media_type: 'tv' }));
      return sendJSON(res, 200, {
        page: 1,
        results: tvShows,
        total_pages: 1,
        total_results: tvShows.length,
        is_fallback: true
      });
    }
  }

  // 4. API: /api/cartoons (Animation genre 16)
  if (pathname === '/api/cartoons') {
    const page = query.page || '1';
    try {
      const data = await fetchTMDB('/discover/movie', {
        with_genres: '16',
        sort_by: 'popularity.desc',
        page
      });
      if (data && Array.isArray(data.results)) {
        data.results = data.results.map(item => ({ ...item, media_type: 'movie' }));
      }
      return sendJSON(res, 200, data);
    } catch (err) {
      console.warn('[TMDB Proxy] Falling back for /api/cartoons:', err.message);
      const cartoons = (FALLBACK_CATALOG.cartoons || FALLBACK_CATALOG.trending.filter(item => (item.genre_ids && item.genre_ids.includes(16)) || item.id === 1022789 || item.id === 569094 || item.id === 94605)).map(c => ({ ...c, media_type: 'movie' }));
      return sendJSON(res, 200, {
        page: 1,
        results: cartoons,
        total_pages: 1,
        total_results: cartoons.length,
        is_fallback: true
      });
    }
  }

  // 5. API: /api/search?q={query}
  if (pathname === '/api/search') {
    const searchParam = (query.q || '').trim();
    const page = query.page || '1';
    if (!searchParam) {
      return sendJSON(res, 200, { page: 1, results: [], total_pages: 0, total_results: 0 });
    }
    try {
      const data = await fetchTMDB('/search/multi', { query: searchParam, page });
      // Filter out people results, keep movie and tv
      if (data && Array.isArray(data.results)) {
        data.results = data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
      }
      return sendJSON(res, 200, data);
    } catch (err) {
      console.warn('[TMDB Proxy] Falling back for /api/search:', err.message);
      const regex = new RegExp(searchParam, 'i');
      const matches = FALLBACK_CATALOG.trending.filter(item =>
        regex.test(item.title || '') || regex.test(item.name || '') || regex.test(item.overview || '')
      );
      return sendJSON(res, 200, {
        page: 1,
        results: matches,
        total_pages: 1,
        total_results: matches.length,
        is_fallback: true
      });
    }
  }

  // 6. API: /api/details/:type/:id
  const detailsMatch = pathname.match(/^\/api\/details\/(movie|tv)\/([^/]+)$/);
  if (detailsMatch) {
    const mediaType = detailsMatch[1];
    const mediaId = detailsMatch[2];
    try {
      const data = await fetchTMDB(`/${mediaType}/${mediaId}`, {
        append_to_response: 'credits,recommendations,similar'
      });
      return sendJSON(res, 200, data);
    } catch (err) {
      console.warn(`[TMDB Proxy] Falling back for details ${mediaType}/${mediaId}:`, err.message);
      const match = FALLBACK_CATALOG.trending.find(item => String(item.id) === String(mediaId));
      if (match) {
        return sendJSON(res, 200, {
          ...match,
          genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 878, name: 'Sci-Fi' }],
          runtime: 128,
          number_of_seasons: 4,
          number_of_episodes: 34,
          credits: {
            cast: [
              { name: 'Lead Actor', character: 'Hero', profile_path: null },
              { name: 'Co-Star', character: 'Partner', profile_path: null }
            ]
          },
          seasons: [
            { season_number: 1, name: 'Season 1', episode_count: 8 },
            { season_number: 2, name: 'Season 2', episode_count: 9 }
          ]
        });
      }
      return sendJSON(res, 404, { error: 'Media not found' });
    }
  }

  // 7. API: /api/tv/:id/season/:seasonNum
  const seasonMatch = pathname.match(/^\/api\/tv\/([^/]+)\/season\/(\d+)$/);
  if (seasonMatch) {
    const tvId = seasonMatch[1];
    const seasonNum = seasonMatch[2];
    try {
      const data = await fetchTMDB(`/tv/${tvId}/season/${seasonNum}`);
      return sendJSON(res, 200, data);
    } catch (err) {
      console.warn(`[TMDB Proxy] Falling back for season tv/${tvId}/${seasonNum}:`, err.message);
      // Generate synthetic episodes for offline mode
      const episodes = [];
      const count = 10;
      for (let i = 1; i <= count; i++) {
        episodes.push({
          episode_number: i,
          name: `Episode ${i}`,
          overview: `Episode ${i} overview description for Season ${seasonNum}.`,
          air_date: '2024-01-01',
          vote_average: 8.0,
          still_path: null
        });
      }
      return sendJSON(res, 200, {
        season_number: parseInt(seasonNum, 10),
        episodes
      });
    }
  }

  // 8. API: /api/stream/movie/:id
  const streamMovieMatch = pathname.match(/^\/api\/stream\/movie\/([^/]+)$/);
  if (streamMovieMatch) {
    const movieId = streamMovieMatch[1];
    return sendJSON(res, 200, getMovieStreamSources(movieId));
  }

  // 9. API: /api/stream/tv/:id/:season/:episode
  const streamTvMatch = pathname.match(/^\/api\/stream\/tv\/([^/]+)\/(\d+)\/(\d+)$/);
  if (streamTvMatch) {
    const tvId = streamTvMatch[1];
    const season = streamTvMatch[2];
    const episode = streamTvMatch[3];
    return sendJSON(res, 200, getTvStreamSources(tvId, season, episode));
  }

  // 10. Serve Static Files from web/
  return serveStaticFile(req, res, pathname);
}

// Server startup and graceful port fallback
let currentPort = PORT;

function startServer(portToListen) {
  const srv = http.createServer(handleRequest);

  srv.on('error', (err) => {
    if ((err.code === 'EADDRINUSE' || err.code === 'EACCES') && portToListen < 5010) {
      const nextPort = portToListen + 1;
      console.warn(`[Port ${portToListen} is in use or restricted]. Automatically trying port ${nextPort}...`);
      currentPort = nextPort;
      startServer(currentPort);
    } else {
      console.error('Server error:', err.message);
    }
  });

  srv.listen(portToListen, () => {
    console.log(`=======================================================`);
    console.log(`  AURORA Streaming Server is running!`);
    console.log(`  Access URL: http://localhost:${portToListen}`);
    console.log(`  Environment: Zero-dependency Node.js native server`);
    console.log(`  TMDB Integrated: Active (Key: ${TMDB_API_KEY.slice(0, 8)}...)`);
    console.log(`=======================================================`);

    // Auto-open browser on local startup (skip in production or cloud hosts)
    const isCloud = process.env.NODE_ENV === 'production' || process.env.RENDER || process.env.RAILWAY_ENVIRONMENT;
    if (process.env.AUTO_OPEN !== 'false' && !isCloud) {
      try {
        const { spawn } = require('child_process');
        if (process.platform === 'win32') {
          spawn('cmd.exe', ['/c', 'start', `http://localhost:${portToListen}`], {
            detached: true,
            stdio: 'ignore'
          }).unref();
        } else if (process.platform === 'darwin') {
          spawn('open', [`http://localhost:${portToListen}`], {
            detached: true,
            stdio: 'ignore'
          }).unref();
        } else {
          spawn('xdg-open', [`http://localhost:${portToListen}`], {
            detached: true,
            stdio: 'ignore'
          }).unref();
        }
      } catch (err) {
        // Fallback silently if exec is disabled
      }
    }
  });
}

startServer(currentPort);


