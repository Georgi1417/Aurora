# Aurora Streaming Platform 🎬

A modern, production-ready movie and TV streaming web application inspired by **Netflix** and **123Movies**, engineered with a zero-dependency native Node.js backend.

---

## 🌟 Key Features

- **Zero-Dependency Native Backend:** Built entirely on Node.js built-ins (`http`, `https`, `fs`, `path`, `url`) on port `5000` with instant startup—no `npm install` needed.
- **Dark Cinematic Aesthetic:**
  - Modern dark color palette (`#0B0B0B` background, `#141414` surface, `#E50914` Netflix red).
  - Inter typography, responsive card layouts with 2:3 aspect ratio posters, HD quality badges, star ratings, and hover effects.
- **Top Navigation Bar:**
  - Brand identity ("AURORA • JOROFLIX").
  - Category navigation tabs: **Home / Trending**, **Movies**, **TV Series**, **Cartoons**, and **My Watchlist**.
  - Real-time search with live autocomplete dropdown and 320ms debouncing.
- **Hero Featured Spotlight:**
  - Dynamic high-resolution backdrop, rating, genre tags, synopsis, and direct "Watch Now" action.
  - Auto-cycling carousel across top trending titles with clickable indicator dots.
- **Video Streaming Player Modal:**
  - Responsive 16:9 embedded player with loading state indicator and full-screen support.
  - **Multi-Server Selector:** Instant switching between high-speed streaming aggregators:
    - ⚡ VidSrc (Fast)
    - 🚀 Embed.su
    - 🎬 VidSrc.xyz
    - 🌐 SuperEmbed
    - 📺 2Embed
    - 🔗 VidLink
    - ⚡ AutoEmbed
  - **TV Series Episode Picker:** Live season dropdown selector and episode chips (`Ep 1`, `Ep 2`, `Ep 3`...) with instant video stream switching.
  - **Cast & Metadata:** Starring cast avatars, runtime, genres, release date, and TMDB rating.
  - **Watchlist Persistence:** Bookmark movies and TV shows locally using `localStorage`.

---

## 📂 Project Structure

```
Aurora/
├── server/
│   └── server.js          # Native zero-dependency Node.js HTTP & API proxy server
├── web/
│   ├── index.html         # Modern HTML5 responsive streaming interface
│   ├── style.css          # Dark cinematic CSS with Netflix/123Movies styling
│   └── app.js             # Client engine: state, API calls, player modal, search
├── start.bat              # Windows one-click startup script
├── package.json           # Optional standard npm manifest
└── README.md              # Project documentation
```

---

## 🚀 How to Run

### Option 1: One-Click Windows Script
Double-click `start.bat` or run:
```cmd
start.bat
```
This starts the Node server on port 5000 and automatically opens `http://localhost:5000` in your default browser.

### Option 2: Command Line (Any OS)
Make sure you have Node.js installed (v14+ recommended), then run:
```bash
node server/server.js
```
Open your browser and navigate to:
```
http://localhost:5000
```

---

## 🔌 API Endpoints

| Endpoint | Description |
| :--- | :--- |
| `GET /api/trending?page=X` | Daily trending movies and TV shows from TMDB |
| `GET /api/movies?page=X` | Popular movies list with pagination |
| `GET /api/tv?page=X` | Popular TV series list with pagination |
| `GET /api/cartoons?page=X` | Popular animation & cartoon movies (genre 16) |
| `GET /api/search?q={query}&page=X` | Multi-search across movies and TV series |
| `GET /api/details/:type/:id` | Detailed metadata, runtime, genres, and cast credits |
| `GET /api/tv/:id/season/:seasonNum` | Episode list with titles and air dates |
| `GET /api/stream/movie/:id` | Multi-server stream URLs for movies |
| `GET /api/stream/tv/:id/:season/:episode` | Multi-server stream URLs for TV episodes |
| `GET /*` | Static file server for `web/` assets (`index.html`, etc.) |

---

## 🛡️ Resilience & Offline Fallbacks

If TMDB is temporarily unreachable or the machine is operating in an isolated network environment, the backend automatically provides a built-in fallback catalog featuring top blockbuster titles so the user interface never breaks or displays empty screens.
