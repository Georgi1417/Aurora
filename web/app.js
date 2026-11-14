/**
 * AURORA STREAMING APP - FRONTEND ENGINE
 * Complete Netflix-Style Profile System, Authentication, TMDB Catalog & Multi-Server Player
 */

(() => {
  'use strict';

  // --- Configuration & Constants ---
  const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
  const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';
  const NO_POSTER_SVG = `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20450%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder%7Bfill%3A%23222%3Bfont-weight%3Abold%3Bfont-family%3AInter%2Csans-serif%3Bfont-size%3A18pt%7D%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder%22%3E%3Crect%20width%3D%22300%22%20height%3D%22450%22%20fill%3D%22%23181818%22%3E%3C%2Frect%3E%3Ctext%20x%3D%2230%25%22%20y%3D%2250%25%22%20fill%3D%22%23555%22%3ENo%20Poster%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fsvg%3E`;

  // Netflix-style Preset Avatars
  // Cinematic Noir Presets & Portraits (Ref Image 3 Alex Morgan)
  const AVATARS = [
    {
      id: 'avatar-red',
      name: 'Alex (Noir)',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      badge: '👑 Premium Member',
      icon: 'detective'
    },
    {
      id: 'avatar-blue',
      name: 'Director (Cinema)',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      badge: '🎬 VIP Director',
      icon: 'film'
    },
    {
      id: 'avatar-yellow',
      name: 'Hollywood Star',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      badge: '⭐ VIP Gold',
      icon: 'star'
    },
    {
      id: 'avatar-green',
      name: 'Shadow Detective',
      img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      badge: '🕵️ Classic Noir',
      icon: 'detective'
    },
    {
      id: 'avatar-purple',
      name: 'Velvet VIP',
      img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
      badge: '👑 Lifetime VIP',
      icon: 'crown'
    },
    {
      id: 'avatar-pink',
      name: 'Film Curator',
      img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      badge: '❤️ Film Curator',
      icon: 'heart'
    },
    {
      id: 'avatar-teal',
      name: '4K Archival',
      img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
      badge: '📽️ 4K Archival',
      icon: 'compass'
    },
    {
      id: 'avatar-kids',
      name: 'Kids Cinema',
      img: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=300&q=80',
      badge: '✨ Kids Cinema',
      icon: 'rainbow'
    }
  ];

  function getAvatarIconSvg(iconType) {
    switch (iconType) {
      case 'detective':
        return `<svg class="avatar-icon-svg" viewBox="0 0 24 24"><path d="M12 2C9.5 2 7.3 3.6 6.5 6H4c-.55 0-1 .45-1 1s.45 1 1 1h1.1c.3 4 3.5 7.2 7.9 7.2s7.6-3.2 7.9-7.2H20c.55 0 1-.45 1-1s-.45-1-1-1h-2.5C16.7 3.6 14.5 2 12 2zm0 16c-3.3 0-6.1 1.6-7.5 4h15c-1.4-2.4-4.2-4-7.5-4z"/></svg>`;
      case 'film':
        return `<svg class="avatar-icon-svg" viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>`;
      case 'star':
        return `<svg class="avatar-icon-svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
      case 'crown':
        return `<svg class="avatar-icon-svg" viewBox="0 0 24 24"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z"/></svg>`;
      case 'heart':
        return `<svg class="avatar-icon-svg" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
      case 'compass':
        return `<svg class="avatar-icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`;
      case 'rainbow':
      default:
        return `<svg class="avatar-icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M12 14c-6.1 0-8 4-8 4v2h16v-2s-1.9-4-8-4z"/></svg>`;
    }
  }

  // Genre map for common TMDB genre IDs
  const GENRE_MAP = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
    80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
    14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
    9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
    53: 'Thriller', 10752: 'War', 37: 'Western', 10759: 'Action & Adventure',
    10762: 'Kids', 10763: 'News', 10764: 'Reality', 10765: 'Sci-Fi & Fantasy'
  };

  // --- App State ---
  const state = {
    activeTab: 'trending',
    searchQuery: '',
    currentPage: 1,
    totalPages: 1,
    activeGenre: 'all',
    currentResults: [],
    trendingHeroItems: [],
    heroIndex: 0,
    heroTimer: null,

    // Active player state
    player: {
      media: null,
      type: 'movie',
      id: null,
      season: 1,
      episode: 1,
      serverIndex: 0,
      streamSources: []
    },

    // Authentication & Netflix Multi-Profiles
    authToken: localStorage.getItem('aurora_auth_token') || null,
    currentUser: null,
    activeProfile: JSON.parse(localStorage.getItem('aurora_active_profile') || 'null'),
    profileWatchlist: [],
    profileHistory: [],
    isManageProfilesMode: false,
    editingProfileId: null,
    selectedAvatarForEdit: 'avatar-red',
    authMode: 'login' // 'login' or 'register'
  };

  // --- DOM Elements ---
  const el = {
    navbar: document.getElementById('navbar'),
    brandLogo: document.getElementById('brandLogo'),
    navLinks: document.querySelectorAll('.nav-link, .mobile-nav-link'),
    watchlistCount: document.getElementById('watchlistCount'),
    mobileWatchlistCount: document.querySelector('.mobile-watchlist-count'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mobileDrawer: document.getElementById('mobileDrawer'),
    searchInput: document.getElementById('searchInput'),
    searchClearBtn: document.getElementById('searchClearBtn'),
    searchDropdown: document.getElementById('searchDropdown'),

    // Auth & Profile Navbar
    navSignInBtn: document.getElementById('navSignInBtn'),
    mobileSignInBtn: document.getElementById('mobileSignInBtn'),
    navUserProfileMenu: document.getElementById('navUserProfileMenu'),
    navProfilePillBtn: document.getElementById('navProfilePillBtn'),
    navProfileAvatar: document.getElementById('navProfileAvatar'),
    navProfileName: document.getElementById('navProfileName'),
    profileDropdownMenu: document.getElementById('profileDropdownMenu'),
    dropdownProfilesList: document.getElementById('dropdownProfilesList'),
    menuSwitchProfileBtn: document.getElementById('menuSwitchProfileBtn'),
    menuManageProfilesBtn: document.getElementById('menuManageProfilesBtn'),
    menuAccountHubBtn: document.getElementById('menuAccountHubBtn'),
    menuOpenProfileViewBtn: document.getElementById('menuOpenProfileViewBtn'),
    dropdownUserEmail: document.getElementById('dropdownUserEmail'),
    menuSignOutBtn: document.getElementById('menuSignOutBtn'),

    // Cinematic Starter Welcome Screen (Image 2 Reference)
    starterScreen: document.getElementById('starterScreen'),
    starterEnterBtn: document.getElementById('starterEnterBtn'),
    starterSignInBtn: document.getElementById('starterSignInBtn'),
    starterMemberAccessBtn: document.getElementById('starterMemberAccessBtn'),
    starterExploreBtn: document.getElementById('starterExploreBtn'),
    starterAuthPanel: document.getElementById('starterAuthPanel'),
    starterAuthForm: document.getElementById('starterAuthForm'),
    starterAuthCloseBtn: document.getElementById('starterAuthCloseBtn'),
    starterTabSignIn: document.getElementById('starterTabSignIn'),
    starterTabSignUp: document.getElementById('starterTabSignUp'),
    starterUsernameGroup: document.getElementById('starterUsernameGroup'),
    starterUsernameInput: document.getElementById('starterUsernameInput'),
    starterEmailLabel: document.getElementById('starterEmailLabel'),
    starterEmailInput: document.getElementById('starterEmailInput'),
    starterPasswordInput: document.getElementById('starterPasswordInput'),
    starterSubmitBtn: document.getElementById('starterSubmitBtn'),
    starterAuthError: document.getElementById('starterAuthError'),
    starterGuestLink: document.getElementById('starterGuestLink'),

    // Explore Cinema Brochure Modal
    brochureModal: document.getElementById('brochureModal'),
    brochureCloseBtn: document.getElementById('brochureCloseBtn'),
    brochureEnterBtn: document.getElementById('brochureEnterBtn'),
    brochureSignInBtn: document.getElementById('brochureSignInBtn'),

    // Profile Dashboard View (Image 3 Reference)
    profileViewScreen: document.getElementById('profileViewScreen'),
    profileViewAvatar: document.getElementById('profileViewAvatar'),
    profileViewName: document.getElementById('profileViewName'),
    profileBadgeText: document.getElementById('profileBadgeText'),
    profileWatchlistBadgeCount: document.getElementById('profileWatchlistBadgeCount'),
    profileSubProfilesCount: document.getElementById('profileSubProfilesCount'),
    profileMenuWatchlist: document.getElementById('profileMenuWatchlist'),
    profileMenuHistory: document.getElementById('profileMenuHistory'),
    profileMenuSwitch: document.getElementById('profileMenuSwitch'),
    profileMenuManage: document.getElementById('profileMenuManage'),
    profileMenuPlayback: document.getElementById('profileMenuPlayback'),
    profileMenuSubscription: document.getElementById('profileMenuSubscription'),
    profileMenuAccount: document.getElementById('profileMenuAccount'),
    profileMenuSignOut: document.getElementById('profileMenuSignOut'),

    // Views
    catalogView: document.getElementById('catalogView'),

    // Netflix "Who's Watching?" Screen
    profilesScreen: document.getElementById('profilesScreen'),
    profilesHeading: document.getElementById('profilesHeading'),
    profilesSubheading: document.getElementById('profilesSubheading'),
    profilesGrid: document.getElementById('profilesGrid'),
    manageProfilesToggleBtn: document.getElementById('manageProfilesToggleBtn'),
    manageProfilesDoneBtn: document.getElementById('manageProfilesDoneBtn'),
    profilesSwitchAccountBtn: document.getElementById('profilesSwitchAccountBtn'),
    profilesBrowseGuestBtn: document.getElementById('profilesBrowseGuestBtn'),

    // Auth Modal Gateway
    authModal: document.getElementById('authModal'),
    authCloseBtn: document.getElementById('authCloseBtn'),
    tabSignIn: document.getElementById('tabSignIn'),
    tabSignUp: document.getElementById('tabSignUp'),
    authForm: document.getElementById('authForm'),
    authErrorMsg: document.getElementById('authErrorMsg'),
    usernameGroup: document.getElementById('usernameGroup'),
    authUsername: document.getElementById('authUsername'),
    authEmail: document.getElementById('authEmail'),
    authEmailLabel: document.getElementById('authEmailLabel'),
    authPassword: document.getElementById('authPassword'),
    authSubmitBtn: document.getElementById('authSubmitBtn'),
    authToggleHint: document.getElementById('authToggleHint'),
    authSwitchLink: document.getElementById('authSwitchLink'),
    guestBrowseBtn: document.getElementById('guestBrowseBtn'),

    // Account Hub & Membership Modal
    accountHubModal: document.getElementById('accountHubModal'),
    accountHubCloseBtn: document.getElementById('accountHubCloseBtn'),
    hubUsername: document.getElementById('hubUsername'),
    hubEmail: document.getElementById('hubEmail'),
    hubProfilesList: document.getElementById('hubProfilesList'),
    hubAddProfileBtn: document.getElementById('hubAddProfileBtn'),
    hubSwitchWhoBtn: document.getElementById('hubSwitchWhoBtn'),
    hubSignOutBtn: document.getElementById('hubSignOutBtn'),

    // Profile Edit / Add Modal
    profileEditModal: document.getElementById('profileEditModal'),
    profileEditCloseBtn: document.getElementById('profileEditCloseBtn'),
    profileModalTitle: document.getElementById('profileModalTitle'),
    profileEditSelectedAvatar: document.getElementById('profileEditSelectedAvatar'),
    avatarPalette: document.getElementById('avatarPalette'),
    profileNameInput: document.getElementById('profileNameInput'),
    profileIsKids: document.getElementById('profileIsKids'),
    saveProfileBtn: document.getElementById('saveProfileBtn'),
    cancelProfileBtn: document.getElementById('cancelProfileBtn'),
    deleteProfileBtn: document.getElementById('deleteProfileBtn'),

    // Hero
    heroBanner: document.getElementById('heroBanner'),
    heroBackdrop: document.getElementById('heroBackdrop'),
    heroBadge: document.getElementById('heroBadge'),
    heroTitle: document.getElementById('heroTitle'),
    heroRating: document.getElementById('heroRating'),
    heroQuality: document.getElementById('heroQuality'),
    heroType: document.getElementById('heroType'),
    heroYear: document.getElementById('heroYear'),
    heroGenres: document.getElementById('heroGenres'),
    heroOverview: document.getElementById('heroOverview'),
    heroWatchBtn: document.getElementById('heroWatchBtn'),
    heroDetailsBtn: document.getElementById('heroDetailsBtn'),
    heroDots: document.getElementById('heroDots'),

    // Continue Watching
    continueWatchingSection: document.getElementById('continueWatchingSection'),
    continueWatchingGrid: document.getElementById('continueWatchingGrid'),

    // Main section
    sectionTitle: document.getElementById('sectionTitle'),
    sectionSubtitle: document.getElementById('sectionSubtitle'),
    genreFilterPills: document.getElementById('genreFilterPills'),
    mediaGrid: document.getElementById('mediaGrid'),
    loadingState: document.getElementById('loadingState'),
    emptyState: document.getElementById('emptyState'),
    emptyResetBtn: document.getElementById('emptyResetBtn'),
    paginationBar: document.getElementById('paginationBar'),
    prevPageBtn: document.getElementById('prevPageBtn'),
    nextPageBtn: document.getElementById('nextPageBtn'),
    pageIndicator: document.getElementById('pageIndicator'),

    // Player Modal
    playerModal: document.getElementById('playerModal'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalExternalBtn: document.getElementById('modalExternalBtn'),
    modalMediaTitle: document.getElementById('modalMediaTitle'),
    modalMetaTag: document.getElementById('modalMetaTag'),
    videoIframe: document.getElementById('videoIframe'),
    playerLoader: document.getElementById('playerLoader'),
    serverPills: document.getElementById('serverPills'),
    tvEpisodesSection: document.getElementById('tvEpisodesSection'),
    seasonSelect: document.getElementById('seasonSelect'),
    episodeCountText: document.getElementById('episodeCountText'),
    episodesChipsGrid: document.getElementById('episodesChipsGrid'),
    modalPoster: document.getElementById('modalPoster'),
    modalRating: document.getElementById('modalRating'),
    modalYear: document.getElementById('modalYear'),
    modalRuntime: document.getElementById('modalRuntime'),
    modalTypeBadge: document.getElementById('modalTypeBadge'),
    modalGenres: document.getElementById('modalGenres'),
    modalOverview: document.getElementById('modalOverview'),
    modalCastList: document.getElementById('modalCastList'),
    modalWatchlistBtn: document.getElementById('modalWatchlistBtn'),
    modalWatchlistText: document.getElementById('modalWatchlistText'),

    // Toast
    toast: document.getElementById('toast')
  };

  // --- API Fetch Helper ---
  async function fetchAPI(endpoint, options = {}) {
    const headers = options.headers || {};
    if (state.authToken) {
      headers['Authorization'] = `Bearer ${state.authToken}`;
    }
    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }
    options.headers = headers;

    const res = await fetch(endpoint, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }
    return data;
  }

  // --- Toast Helper ---
  let toastTimer = null;
  function showToast(message) {
    if (toastTimer) clearTimeout(toastTimer);
    el.toast.textContent = message;
    el.toast.classList.add('show');
    toastTimer = setTimeout(() => {
      el.toast.classList.remove('show');
    }, 3200);
  }

  // --- Authentication Management ---
  async function checkAuthSession() {
    if (!state.authToken) {
      renderNavUserUI();
      // First thing that pops up on launch: The Cinematic Starter Screen (Image 2)
      showStarterScreen();
      return;
    }

    try {
      const data = await fetchAPI('/api/auth/me');
      state.currentUser = data.user;
      hideStarterScreen();

      // Validate or set active profile
      const profiles = state.currentUser.profiles || [];
      if (profiles.length > 0) {
        if (!state.activeProfile || !profiles.some(p => p.id === state.activeProfile.id)) {
          state.activeProfile = profiles[0];
        } else {
          // Refresh active profile metadata
          state.activeProfile = profiles.find(p => p.id === state.activeProfile.id);
        }
        localStorage.setItem('aurora_active_profile', JSON.stringify(state.activeProfile));
        loadActiveProfileData();
        // First thing that pops up for logged-in user: Who's watching?
        setTimeout(() => openProfilesScreen(), 200);
      } else {
        openProfilesScreen();
      }
    } catch (err) {
      console.warn('Session expired or invalid:', err.message);
      signOut(false);
      showStarterScreen();
    }
    renderNavUserUI();
  }

  function renderNavUserUI() {
    if (state.currentUser && state.activeProfile) {
      el.navSignInBtn.style.display = 'none';
      if (el.mobileSignInBtn) el.mobileSignInBtn.style.display = 'none';
      el.navUserProfileMenu.style.display = 'block';

      // Update avatar & name
      el.navProfileName.textContent = state.activeProfile.name;
      setAvatarElementClassAndIcon(el.navProfileAvatar, state.activeProfile.avatar);

      // Dropdown user info
      el.dropdownUserEmail.textContent = `${state.currentUser.email}`;

      // Populate other profiles in dropdown for fast 1-click switching
      const otherProfiles = (state.currentUser.profiles || []).filter(p => p.id !== state.activeProfile.id);
      el.dropdownProfilesList.innerHTML = '';
      otherProfiles.forEach(p => {
        const item = document.createElement('button');
        item.className = 'dropdown-profile-item';
        item.innerHTML = `
          <div class="avatar-badge avatar-sm ${escapeHTML(p.avatar)}">
            ${getAvatarIconSvg(getAvatarIcon(p.avatar))}
          </div>
          <span class="dropdown-profile-name">${escapeHTML(p.name)}</span>
        `;
        item.addEventListener('click', () => {
          setActiveProfile(p);
          closeDropdown();
          showToast(`Switched profile to ${p.name}`);
        });
        el.dropdownProfilesList.appendChild(item);
      });
    } else {
      el.navSignInBtn.style.display = 'inline-block';
      if (el.mobileSignInBtn) el.mobileSignInBtn.style.display = 'block';
      el.navUserProfileMenu.style.display = 'none';
    }
  }

  function getAvatarIcon(avatarClass) {
    const found = AVATARS.find(a => a.id === avatarClass);
    return found ? found.icon : 'detective';
  }

  function setAvatarElementClassAndIcon(elem, avatarClass) {
    if (!elem) return;
    AVATARS.forEach(a => elem.classList.remove(a.id));
    const safeClass = avatarClass || 'avatar-red';
    elem.classList.add(safeClass);
    const avatar = AVATARS.find(a => a.id === safeClass) || AVATARS[0];
    elem.innerHTML = `
      <img class="profile-avatar-img" src="${avatar.img}" alt="${avatar.name}" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
      <div class="avatar-fallback-icon" style="display: none;">
        ${getAvatarIconSvg(avatar.icon)}
      </div>
    `;
  }

  // --- Starter Welcome Screen Controls (Image 2 Reference) ---
  function showStarterScreen() {
    if (el.starterScreen) el.starterScreen.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function hideStarterScreen() {
    if (el.starterScreen) el.starterScreen.style.display = 'none';
    document.body.style.overflow = '';
  }

  function openStarterAuth(mode = 'login') {
    state.authMode = mode;
    setStarterAuthMode(mode);
    if (el.starterAuthError) el.starterAuthError.style.display = 'none';
    if (el.starterAuthPanel) el.starterAuthPanel.style.display = 'block';
    setTimeout(() => {
      (mode === 'register' ? el.starterUsernameInput : el.starterEmailInput)?.focus();
    }, 100);
  }

  function closeStarterAuth() {
    if (el.starterAuthPanel) el.starterAuthPanel.style.display = 'none';
  }

  // --- Explore Cinema Brochure Controls ---
  function openBrochureModal() {
    if (el.brochureModal) {
      el.brochureModal.classList.add('active');
      el.brochureModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeBrochureModal() {
    if (el.brochureModal) {
      el.brochureModal.classList.remove('active');
      el.brochureModal.setAttribute('aria-hidden', 'true');
    }
  }

  function setStarterAuthMode(mode) {
    state.authMode = mode;
    if (mode === 'register') {
      el.starterTabSignIn?.classList.remove('active');
      el.starterTabSignUp?.classList.add('active');
      if (el.starterUsernameGroup) el.starterUsernameGroup.style.display = 'flex';
      if (el.starterEmailLabel) el.starterEmailLabel.textContent = 'Email Address';
      if (el.starterEmailInput) el.starterEmailInput.placeholder = 'name@example.com';
      if (el.starterSubmitBtn) el.starterSubmitBtn.textContent = 'Create VIP Account';
    } else {
      el.starterTabSignIn?.classList.add('active');
      el.starterTabSignUp?.classList.remove('active');
      if (el.starterUsernameGroup) el.starterUsernameGroup.style.display = 'none';
      if (el.starterEmailLabel) el.starterEmailLabel.textContent = 'Email or Username';
      if (el.starterEmailInput) el.starterEmailInput.placeholder = 'Enter email or username';
      if (el.starterSubmitBtn) el.starterSubmitBtn.textContent = 'Sign In';
    }
  }

  async function handleStarterAuthSubmit(e) {
    e.preventDefault();
    if (!el.starterSubmitBtn) return;
    el.starterAuthError.style.display = 'none';
    el.starterSubmitBtn.disabled = true;

    try {
      if (state.authMode === 'register') {
        const username = el.starterUsernameInput.value.trim();
        const email = el.starterEmailInput.value.trim();
        const password = el.starterPasswordInput.value;

        const data = await fetchAPI('/api/auth/register', {
          method: 'POST',
          body: { username, email, password }
        });

        state.authToken = data.token;
        localStorage.setItem('aurora_auth_token', data.token);
        state.currentUser = data.user;
        setActiveProfile(data.activeProfile);

        hideStarterScreen();
        showToast(`Welcome to Aurora, ${data.user.username}!`);
        openProfilesScreen();
      } else {
        const emailOrUsername = el.starterEmailInput.value.trim();
        const password = el.starterPasswordInput.value;

        const data = await fetchAPI('/api/auth/login', {
          method: 'POST',
          body: { emailOrUsername, password }
        });

        state.authToken = data.token;
        localStorage.setItem('aurora_auth_token', data.token);
        state.currentUser = data.user;
        setActiveProfile(data.activeProfile);

        hideStarterScreen();
        showToast(`Signed in as ${data.user.username}`);
        openProfilesScreen();
      }
    } catch (err) {
      if (el.starterAuthError) {
        el.starterAuthError.textContent = err.message || 'Authentication error';
        el.starterAuthError.style.display = 'block';
      }
    } finally {
      el.starterSubmitBtn.disabled = false;
    }
  }

  // Helper to toggle hero banner & adjust catalog layout / navbar clearance
  function updateHeroVisibility(showHero) {
    if (el.heroBanner) {
      el.heroBanner.style.display = showHero ? 'flex' : 'none';
    }
    if (el.catalogView) {
      el.catalogView.classList.toggle('has-hero', showHero);
      el.catalogView.classList.toggle('no-hero', !showHero);
    }
    document.body.classList.toggle('no-hero-view', !showHero);
    updateNavbarBackground();
  }

  function updateNavbarBackground() {
    if (!el.navbar) return;
    const isHeroVisible = el.heroBanner && el.heroBanner.style.display !== 'none' && state.activeTab === 'trending';
    const isScrolled = window.scrollY > 25;
    if (!isHeroVisible || isScrolled) {
      el.navbar.classList.add('scrolled');
    } else {
      el.navbar.classList.remove('scrolled');
    }
  }

  // --- Profile View Screen Controls (Image 3 Reference) ---
  function showProfileView() {
    state.activeTab = 'profile';
    setActiveNavLink('profile');

    if (el.catalogView) el.catalogView.style.display = 'none';
    if (el.profileViewScreen) el.profileViewScreen.style.display = 'flex';
    document.body.classList.add('no-hero-view');
    updateNavbarBackground();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Populate data
    const profile = state.activeProfile || (state.currentUser?.profiles?.[0]) || { name: 'Alex Morgan', avatar: 'avatar-red', isKids: false };
    if (el.profileViewName) el.profileViewName.textContent = profile.name;
    if (el.profileViewAvatar) setAvatarElementClassAndIcon(el.profileViewAvatar, profile.avatar);
    if (el.profileBadgeText) el.profileBadgeText.textContent = profile.isKids ? 'Kids Profile' : 'Premium Member';
    if (el.profileWatchlistBadgeCount) el.profileWatchlistBadgeCount.textContent = (state.profileWatchlist || []).length;
    if (el.profileSubProfilesCount) el.profileSubProfilesCount.textContent = `${state.currentUser ? (state.currentUser.profiles || []).length : 1} Profiles`;
  }

  function hideProfileView() {
    if (el.profileViewScreen) el.profileViewScreen.style.display = 'none';
    if (el.catalogView) el.catalogView.style.display = 'block';
    updateHeroVisibility(state.activeTab === 'trending');
  }

  // --- Profile Switching & "Who's Watching?" ---
  function setActiveProfile(profile) {
    state.activeProfile = profile;
    localStorage.setItem('aurora_active_profile', JSON.stringify(profile));
    renderNavUserUI();
    loadActiveProfileData();

    // If this is a kids profile, adapt category if needed
    if (profile.isKids && state.activeTab !== 'cartoons') {
      showToast(`Welcome ${profile.name}! Kids mode active.`);
    }
  }

  async function loadActiveProfileData() {
    if (!state.authToken || !state.activeProfile) {
      // Guest fallback to localStorage
      state.profileWatchlist = JSON.parse(localStorage.getItem('aurora_watchlist') || '[]');
      state.profileHistory = [];
      updateWatchlistCounters();
      renderContinueWatching();
      return;
    }

    try {
      const data = await fetchAPI(`/api/profiles/${state.activeProfile.id}/data`);
      state.profileWatchlist = data.watchlist || [];
      state.profileHistory = data.history || [];
      updateWatchlistCounters();
      renderContinueWatching();
      if (state.activeTab === 'watchlist') {
        renderWatchlist();
      }
    } catch (err) {
      console.warn('Could not load profile data:', err.message);
    }
  }

  function openProfilesScreen() {
    if (!state.currentUser) {
      openAuthModal('login');
      return;
    }
    state.isManageProfilesMode = false;
    el.profilesScreen.classList.remove('manage-mode');
    el.profilesHeading.textContent = "Who's watching?";
    el.profilesSubheading.textContent = "Select a profile to jump straight into your personalized recommendations";
    el.manageProfilesToggleBtn.style.display = 'inline-block';
    el.manageProfilesDoneBtn.style.display = 'none';
    renderProfilesScreenGrid();
    el.profilesScreen.style.display = 'flex';
  }

  function closeProfilesScreen() {
    el.profilesScreen.style.display = 'none';
    state.isManageProfilesMode = false;
  }

  function renderProfilesScreenGrid() {
    el.profilesGrid.innerHTML = '';
    const profiles = state.currentUser ? (state.currentUser.profiles || []) : [];

    profiles.forEach(p => {
      const card = document.createElement('button');
      card.className = 'profile-card';
      const avatarDef = AVATARS.find(a => a.id === p.avatar) || AVATARS[0];
      const meta = p.isKids ? '✨ Kids Cinema' : (avatarDef.badge || '👑 Premium Member');
      card.innerHTML = `
        <div class="profile-card-avatar-wrap">
          <div class="avatar-badge avatar-lg ${escapeHTML(p.avatar)}">
            <img class="profile-avatar-img" src="${avatarDef.img}" alt="${escapeHTML(p.name)}" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
            <div class="avatar-fallback-icon" style="display: none;">
              ${getAvatarIconSvg(avatarDef.icon)}
            </div>
          </div>
          ${p.isKids ? '<span class="profile-kids-badge">KIDS</span>' : ''}
          <div class="profile-edit-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </div>
        </div>
        <span class="profile-card-name">${escapeHTML(p.name)}</span>
        <span class="profile-meta-text">${meta}</span>
      `;

      card.addEventListener('click', () => {
        if (state.isManageProfilesMode) {
          openProfileEditModal(p);
        } else {
          setActiveProfile(p);
          closeProfilesScreen();
          showToast(`Welcome, ${p.name}!`);
        }
      });

      el.profilesGrid.appendChild(card);
    });

    // Add Profile Button (allow up to 10 profiles)
    if (profiles.length < 10) {
      const addCard = document.createElement('button');
      addCard.className = 'profile-card profile-card-add';
      addCard.innerHTML = `
        <div class="profile-card-avatar-wrap">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </div>
        <span class="profile-card-name">Add Profile</span>
        <span class="profile-meta-text">+ New Cinema Space</span>
      `;
      addCard.addEventListener('click', () => {
        openProfileEditModal(null);
      });
      el.profilesGrid.appendChild(addCard);
    }
  }

  // --- Profile Add / Edit Modal ---
  function openProfileEditModal(profileToEdit = null) {
    state.editingProfileId = profileToEdit ? profileToEdit.id : null;
    el.profileModalTitle.textContent = profileToEdit ? 'Edit Profile' : 'Add Profile';
    el.profileNameInput.value = profileToEdit ? profileToEdit.name : '';
    el.profileIsKids.checked = profileToEdit ? !!profileToEdit.isKids : false;

    // Pick avatar
    const initialAvatar = profileToEdit ? profileToEdit.avatar : AVATARS[(state.currentUser?.profiles?.length || 0) % AVATARS.length].id;
    state.selectedAvatarForEdit = initialAvatar;
    setAvatarElementClassAndIcon(el.profileEditSelectedAvatar, initialAvatar);

    // Render palette
    renderAvatarPalette();

    // Delete button (allowed only in edit mode and when > 1 profile)
    if (profileToEdit && state.currentUser && state.currentUser.profiles.length > 1) {
      el.deleteProfileBtn.style.display = 'inline-block';
      el.deleteProfileBtn.onclick = () => handleDeleteProfile(profileToEdit.id);
    } else {
      el.deleteProfileBtn.style.display = 'none';
    }

    el.profileEditModal.classList.add('active');
    el.profileNameInput.focus();
  }

  function closeProfileEditModal() {
    el.profileEditModal.classList.remove('active');
    state.editingProfileId = null;
  }

  function renderAvatarPalette() {
    el.avatarPalette.innerHTML = '';
    AVATARS.forEach(a => {
      const item = document.createElement('div');
      item.className = `palette-item ${state.selectedAvatarForEdit === a.id ? 'selected' : ''}`;
      item.title = a.name;
      item.innerHTML = `
        <img class="profile-avatar-img" src="${a.img}" alt="${a.name}" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
        <div class="avatar-fallback-icon" style="display: none;">${getAvatarIconSvg(a.icon)}</div>
      `;
      item.addEventListener('click', () => {
        state.selectedAvatarForEdit = a.id;
        setAvatarElementClassAndIcon(el.profileEditSelectedAvatar, a.id);
        el.avatarPalette.querySelectorAll('.palette-item').forEach(p => p.classList.remove('selected'));
        item.classList.add('selected');
      });
      el.avatarPalette.appendChild(item);
    });
  }

  async function handleSaveProfile() {
    const name = el.profileNameInput.value.trim();
    if (!name) {
      showToast('Please enter a profile name');
      el.profileNameInput.focus();
      return;
    }

    const avatar = state.selectedAvatarForEdit;
    const isKids = el.profileIsKids.checked;

    try {
      if (state.editingProfileId) {
        // Update profile with resilient local fallback
        let updatedProfile = null;
        try {
          const data = await fetchAPI('/api/profiles/update', {
            method: 'PUT',
            body: { profileId: state.editingProfileId, name, avatar, isKids }
          });
          if (data && data.user) state.currentUser = data.user;
          updatedProfile = data?.profile;
        } catch (apiErr) {
          console.warn('Backend update failed, updating locally:', apiErr.message);
          if (state.currentUser && state.currentUser.profiles) {
            const p = state.currentUser.profiles.find(item => item.id === state.editingProfileId);
            if (p) {
              p.name = name;
              p.avatar = avatar;
              p.isKids = isKids;
              updatedProfile = p;
            }
          }
        }

        if (state.activeProfile && state.activeProfile.id === state.editingProfileId) {
          setActiveProfile(updatedProfile || { ...state.activeProfile, name, avatar, isKids });
        }
        showToast('Profile updated!');
      } else {
        // Create profile with resilient local fallback
        let newProfile = null;
        try {
          const data = await fetchAPI('/api/profiles/create', {
            method: 'POST',
            body: { name, avatar, isKids }
          });
          if (data && data.user) state.currentUser = data.user;
          newProfile = data?.profile;
        } catch (apiErr) {
          console.warn('Backend create failed, saving profile locally:', apiErr.message);
          newProfile = {
            id: 'prof_' + Math.random().toString(36).slice(2, 10),
            name,
            avatar,
            isKids,
            watchlist: [],
            history: []
          };
          if (!state.currentUser) {
            state.currentUser = { id: 'usr_active', username: name, email: `${name.toLowerCase()}@aurora.cinema`, profiles: [] };
          }
          if (!state.currentUser.profiles) state.currentUser.profiles = [];
          state.currentUser.profiles.push(newProfile);
        }

        if (!state.activeProfile) {
          setActiveProfile(newProfile);
        }
        showToast(`Profile "${name}" created!`);
      }

      closeProfileEditModal();
      renderProfilesScreenGrid();
      renderNavUserUI();
    } catch (err) {
      showToast(err.message || 'Error saving profile');
    }
  }

  async function handleDeleteProfile(profileId) {
    if (!confirm('Are you sure you want to delete this profile? All saved watchlist history will be removed.')) {
      return;
    }

    try {
      const data = await fetchAPI(`/api/profiles/${profileId}`, { method: 'DELETE' });
      state.currentUser = data.user;

      if (state.activeProfile && state.activeProfile.id === profileId) {
        setActiveProfile(state.currentUser.profiles[0]);
      }

      showToast('Profile deleted');
      closeProfileEditModal();
      renderProfilesScreenGrid();
      renderNavUserUI();
    } catch (err) {
      showToast(err.message || 'Error deleting profile');
    }
  }

  // --- Account Hub & VIP Membership Modal ---
  function openAccountHubModal() {
    if (!state.currentUser) {
      openAuthModal('login');
      return;
    }
    el.hubUsername.textContent = state.currentUser.username;
    el.hubEmail.textContent = state.currentUser.email;

    // Render profiles list in hub
    el.hubProfilesList.innerHTML = '';
    const profiles = state.currentUser.profiles || [];
    profiles.forEach(p => {
      const row = document.createElement('div');
      row.className = 'hub-profile-row';
      const isCurrent = state.activeProfile && state.activeProfile.id === p.id;
      row.innerHTML = `
        <div class="hub-profile-left">
          <div class="avatar-badge avatar-md ${escapeHTML(p.avatar)}">
            ${getAvatarIconSvg(getAvatarIcon(p.avatar))}
          </div>
          <div class="hub-profile-info">
            <div class="hub-profile-name">
              ${escapeHTML(p.name)}
              ${isCurrent ? ' <span style="background: rgba(229,9,20,0.2); color: #E50914; font-size: 0.68rem; font-weight: 800; padding: 1px 6px; border-radius: 3px;">ACTIVE</span>' : ''}
              ${p.isKids ? ' <span style="background: rgba(255,193,7,0.2); color: #FFC107; font-size: 0.68rem; font-weight: 800; padding: 1px 6px; border-radius: 3px;">KIDS</span>' : ''}
            </div>
            <div class="hub-profile-meta">${p.watchlistCount || 0} saved titles • ${p.historyCount || 0} watched</div>
          </div>
        </div>
        <div class="hub-profile-right">
          <button class="btn btn-secondary btn-sm hub-edit-p-btn">Edit</button>
        </div>
      `;
      row.querySelector('.hub-edit-p-btn').addEventListener('click', () => {
        closeAccountHubModal();
        openProfileEditModal(p);
      });
      el.hubProfilesList.appendChild(row);
    });

    el.accountHubModal.classList.add('active');
  }

  function closeAccountHubModal() {
    el.accountHubModal.classList.remove('active');
  }

  // --- Auth Modal (Login / Register) ---
  function openAuthModal(mode = 'login') {
    state.authMode = mode;
    setAuthModalMode(mode);
    el.authErrorMsg.style.display = 'none';
    el.authErrorMsg.textContent = '';
    el.authForm.reset();
    el.authModal.classList.add('active');
    setTimeout(() => {
      (mode === 'register' ? el.authUsername : el.authEmail).focus();
    }, 100);
  }

  function closeAuthModal() {
    el.authModal.classList.remove('active');
  }

  function setAuthModalMode(mode) {
    state.authMode = mode;
    if (mode === 'register') {
      el.tabSignIn.classList.remove('active');
      el.tabSignUp.classList.add('active');
      el.usernameGroup.style.display = 'flex';
      el.authEmailLabel.textContent = 'Email Address';
      el.authEmail.placeholder = 'name@example.com';
      el.authSubmitBtn.textContent = 'Create Account';
      el.authToggleHint.textContent = 'Already have an account?';
      el.authSwitchLink.textContent = 'Sign In';
    } else {
      el.tabSignIn.classList.add('active');
      el.tabSignUp.classList.remove('active');
      el.usernameGroup.style.display = 'none';
      el.authEmailLabel.textContent = 'Email or Username';
      el.authEmail.placeholder = 'Enter email or username';
      el.authSubmitBtn.textContent = 'Sign In';
      el.authToggleHint.textContent = 'New to Aurora?';
      el.authSwitchLink.textContent = 'Sign up now';
    }
  }

  async function handleAuthSubmit(e) {
    e.preventDefault();
    el.authErrorMsg.style.display = 'none';
    el.authSubmitBtn.disabled = true;

    try {
      if (state.authMode === 'register') {
        const username = el.authUsername.value.trim();
        const email = el.authEmail.value.trim();
        const password = el.authPassword.value;

        const data = await fetchAPI('/api/auth/register', {
          method: 'POST',
          body: { username, email, password }
        });

        state.authToken = data.token;
        localStorage.setItem('aurora_auth_token', data.token);
        state.currentUser = data.user;
        setActiveProfile(data.activeProfile);

        closeAuthModal();
        showToast(`Welcome to Aurora, ${data.user.username}!`);
        openProfilesScreen();
      } else {
        const emailOrUsername = el.authEmail.value.trim();
        const password = el.authPassword.value;

        const data = await fetchAPI('/api/auth/login', {
          method: 'POST',
          body: { emailOrUsername, password }
        });

        state.authToken = data.token;
        localStorage.setItem('aurora_auth_token', data.token);
        state.currentUser = data.user;
        setActiveProfile(data.activeProfile);

        closeAuthModal();
        showToast(`Signed in as ${data.user.username}`);
        openProfilesScreen();
      }
    } catch (err) {
      el.authErrorMsg.textContent = err.message || 'Authentication error';
      el.authErrorMsg.style.display = 'block';
    } finally {
      el.authSubmitBtn.disabled = false;
    }
  }

  function signOut(notify = true) {
    if (state.authToken) {
      fetchAPI('/api/auth/logout', { method: 'POST' }).catch(() => {});
    }
    state.authToken = null;
    state.currentUser = null;
    state.activeProfile = null;
    localStorage.removeItem('aurora_auth_token');
    localStorage.removeItem('aurora_active_profile');
    renderNavUserUI();
    loadActiveProfileData();
    closeDropdown();
    hideProfileView();
    if (notify) {
      showToast('Signed out of Aurora');
      showStarterScreen();
    }
  }

  function closeDropdown() {
    el.userProfileMenu = el.navUserProfileMenu;
    el.userProfileMenu.classList.remove('open');
  }

  // --- Continue Watching Section ---
  function renderContinueWatching() {
    if (!el.continueWatchingSection) return;
    const history = state.profileHistory || [];

    if (history.length === 0 || state.activeTab !== 'trending') {
      el.continueWatchingSection.style.display = 'none';
      return;
    }

    el.continueWatchingSection.style.display = 'block';
    el.continueWatchingGrid.innerHTML = history.slice(0, 4).map(item => {
      const title = item.title || item.name || 'Untitled';
      const backdrop = item.backdrop_path ? `${TMDB_IMAGE_BASE}${item.backdrop_path}` : (item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : '');
      const subtitle = item.media_type === 'tv' ? `Season ${item.season || 1} • Episode ${item.episode || 1}` : 'Feature Film';

      return `
        <div class="continue-card" data-id="${item.id}" data-type="${item.media_type || 'movie'}" data-season="${item.season || 1}" data-episode="${item.episode || 1}">
          <div class="continue-backdrop-wrap">
            <img class="continue-backdrop" src="${backdrop}" alt="${escapeHTML(title)}" loading="lazy">
            <div class="card-overlay">
              <div class="play-icon-circle">
                <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </div>
            </div>
            <div class="continue-progress-bar">
              <div class="continue-progress-fill"></div>
            </div>
          </div>
          <div class="continue-card-info">
            <div class="continue-title" title="${escapeHTML(title)}">${escapeHTML(title)}</div>
            <div class="continue-subtitle">${subtitle}</div>
          </div>
        </div>
      `;
    }).join('');

    el.continueWatchingGrid.querySelectorAll('.continue-card').forEach((card, idx) => {
      card.addEventListener('click', () => {
        const item = history[idx];
        openPlayerModal(item, item.season || 1, item.episode || 1);
      });
    });
  }

  // --- Watchlist Persistence & Syncing ---
  function updateWatchlistCounters() {
    const count = (state.profileWatchlist || []).length;
    if (el.watchlistCount) el.watchlistCount.textContent = count;
    if (el.mobileWatchlistCount) el.mobileWatchlistCount.textContent = count;
  }

  function isInWatchlist(id) {
    return (state.profileWatchlist || []).some(item => String(item.id) === String(id));
  }

  async function toggleWatchlist(media) {
    const id = String(media.id);
    const inList = isInWatchlist(id);

    if (state.authToken && state.activeProfile) {
      // Sync with server profile
      try {
        const data = await fetchAPI(`/api/profiles/${state.activeProfile.id}/watchlist`, {
          method: 'POST',
          body: { media }
        });
        state.profileWatchlist = data.watchlist;
        updateWatchlistCounters();
        updateModalWatchlistBtn(media);
        showToast(inList ? `Removed from ${state.activeProfile.name}'s Watchlist` : `Saved to ${state.activeProfile.name}'s Watchlist`);
      } catch (err) {
        showToast('Error syncing watchlist');
      }
    } else {
      // Guest local storage fallback
      let list = JSON.parse(localStorage.getItem('aurora_watchlist') || '[]');
      const index = list.findIndex(item => String(item.id) === id);
      if (index >= 0) {
        list.splice(index, 1);
        showToast(`Removed "${media.title || media.name}" from Watchlist`);
      } else {
        list.unshift(media);
        showToast(`Added "${media.title || media.name}" to Watchlist`);
      }
      localStorage.setItem('aurora_watchlist', JSON.stringify(list));
      state.profileWatchlist = list;
      updateWatchlistCounters();
      updateModalWatchlistBtn(media);
    }

    if (state.activeTab === 'watchlist') {
      renderWatchlist();
    }
  }

  function updateModalWatchlistBtn(media) {
    if (!media) return;
    const inList = isInWatchlist(media.id);
    if (inList) {
      el.modalWatchlistText.textContent = 'Remove from Watchlist';
      el.modalWatchlistBtn.classList.add('btn-primary');
      el.modalWatchlistBtn.classList.remove('btn-secondary');
    } else {
      el.modalWatchlistText.textContent = 'Bookmark to Watchlist';
      el.modalWatchlistBtn.classList.remove('btn-primary');
      el.modalWatchlistBtn.classList.add('btn-secondary');
    }
  }

  // --- Hero Banner Carousel ---
  function setupHeroBanner(items) {
    if (!items || !items.length) return;
    state.trendingHeroItems = items.slice(0, 5);
    state.heroIndex = 0;

    el.heroDots.innerHTML = '';
    state.trendingHeroItems.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `hero-dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        setHeroItem(idx);
        restartHeroTimer();
      });
      el.heroDots.appendChild(dot);
    });

    setHeroItem(0);
    restartHeroTimer();
  }

  function setHeroItem(index) {
    if (!state.trendingHeroItems[index]) return;
    state.heroIndex = index;
    const item = state.trendingHeroItems[index];

    const backdropUrl = item.backdrop_path
      ? `${TMDB_BACKDROP_BASE}${item.backdrop_path}`
      : (item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : '');

    el.heroBackdrop.style.opacity = '0';
    setTimeout(() => {
      if (backdropUrl) {
        el.heroBackdrop.style.backgroundImage = `url('${backdropUrl}')`;
      } else {
        el.heroBackdrop.style.backgroundImage = 'none';
      }
      el.heroBackdrop.style.opacity = '1';
    }, 200);

    const title = item.title || item.name || 'Untitled';
    const type = item.media_type === 'tv' ? 'TV SERIES' : 'MOVIE';
    const year = (item.release_date || item.first_air_date || '2024').slice(0, 4);
    const rating = item.vote_average ? item.vote_average.toFixed(1) : '8.0';

    el.heroTitle.textContent = title;
    el.heroRating.textContent = rating;
    el.heroType.textContent = type;
    el.heroYear.textContent = year;
    el.heroOverview.textContent = item.overview || 'No synopsis available for this title.';

    if (item.genre_ids && item.genre_ids.length) {
      el.heroGenres.textContent = item.genre_ids.slice(0, 3).map(id => GENRE_MAP[id] || '').filter(Boolean).join(', ');
    } else {
      el.heroGenres.textContent = type === 'TV SERIES' ? 'Drama, Series' : 'Action, Adventure';
    }

    const dots = el.heroDots.querySelectorAll('.hero-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });

    el.heroWatchBtn.onclick = () => openPlayerModal(item);
    el.heroDetailsBtn.onclick = () => openPlayerModal(item);
  }

  function restartHeroTimer() {
    if (state.heroTimer) clearInterval(state.heroTimer);
    state.heroTimer = setInterval(() => {
      if (!state.trendingHeroItems.length) return;
      const nextIndex = (state.heroIndex + 1) % state.trendingHeroItems.length;
      setHeroItem(nextIndex);
    }, 8000);
  }

  // --- Main Catalog Loader & Grid Renderer ---
  async function loadCatalog(page = 1) {
    state.currentPage = page;
    el.loadingState.style.display = 'flex';
    el.emptyState.style.display = 'none';
    el.mediaGrid.innerHTML = '';
    el.paginationBar.style.display = 'none';

    let endpoint = '';
    if (state.activeTab === 'trending') {
      endpoint = `/api/trending?page=${page}`;
      el.sectionTitle.textContent = 'Trending Today';
      el.sectionSubtitle.textContent = 'Top daily movies and TV shows worldwide';
      updateHeroVisibility(true);
      renderContinueWatching();
    } else if (state.activeTab === 'movies') {
      endpoint = `/api/movies?page=${page}`;
      el.sectionTitle.textContent = 'Popular Movies';
      el.sectionSubtitle.textContent = 'Latest blockbuster feature films';
      updateHeroVisibility(false);
      if (el.continueWatchingSection) el.continueWatchingSection.style.display = 'none';
    } else if (state.activeTab === 'tv') {
      endpoint = `/api/tv?page=${page}`;
      el.sectionTitle.textContent = 'Popular TV Series';
      el.sectionSubtitle.textContent = 'Binge-worthy drama, action, and episodic series';
      updateHeroVisibility(false);
      if (el.continueWatchingSection) el.continueWatchingSection.style.display = 'none';
    } else if (state.activeTab === 'cartoons') {
      endpoint = `/api/cartoons?page=${page}`;
      el.sectionTitle.textContent = 'Animation & Cartoons';
      el.sectionSubtitle.textContent = 'Best animated movies, anime, and family entertainment';
      updateHeroVisibility(false);
      if (el.continueWatchingSection) el.continueWatchingSection.style.display = 'none';
    } else if (state.activeTab === 'search') {
      endpoint = `/api/search?q=${encodeURIComponent(state.searchQuery)}&page=${page}`;
      el.sectionTitle.textContent = `Search: "${state.searchQuery}"`;
      el.sectionSubtitle.textContent = 'Matching movies and TV shows';
      updateHeroVisibility(false);
      if (el.continueWatchingSection) el.continueWatchingSection.style.display = 'none';
    } else if (state.activeTab === 'watchlist') {
      renderWatchlist();
      return;
    }

    try {
      const data = await fetchAPI(endpoint);
      el.loadingState.style.display = 'none';

      let items = (data && data.results) ? data.results : [];
      items = items.filter(item => item && (item.title || item.name));

      if (state.activeTab === 'movies') {
        items = items.map(item => ({ ...item, media_type: 'movie' }));
      } else if (state.activeTab === 'tv') {
        items = items.map(item => ({ ...item, media_type: 'tv' }));
      } else if (state.activeTab === 'cartoons') {
        items = items.map(item => ({ ...item, media_type: 'movie' }));
      }

      if (items.length === 0 && (state.activeTab === 'movies' || state.activeTab === 'tv' || state.activeTab === 'cartoons' || state.activeTab === 'trending')) {
        items = getFallbackTitles(state.activeTab);
      }

      state.currentResults = items;
      state.totalPages = Math.max(Math.min(data.total_pages || 1, 100), 1);

      if (state.activeTab === 'trending' && page === 1 && items.length > 0) {
        setupHeroBanner(items);
      }

      applyGenreFilterAndRender();
    } catch (err) {
      console.warn('loadCatalog failed, using local catalog:', err.message);
      const fallbackItems = getFallbackTitles(state.activeTab);
      el.loadingState.style.display = 'none';
      if (fallbackItems.length > 0) {
        state.currentResults = fallbackItems;
        state.totalPages = 1;
        applyGenreFilterAndRender();
      } else {
        el.emptyState.style.display = 'block';
        el.emptyTitle.textContent = 'No titles found';
        el.emptyDesc.textContent = 'Please check your connection or select another category.';
      }
    }
  }

  function getFallbackTitles(tab) {
    const allTitles = [
      {
        id: 533535,
        title: 'Deadpool & Wolverine',
        media_type: 'movie',
        poster_path: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
        backdrop_path: '/yD38bO7a5gq4J5L4H6Y7p1GqZ0u.jpg',
        vote_average: 7.7,
        release_date: '2024-07-24',
        genre_ids: [28, 35, 878],
        overview: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.'
      },
      {
        id: 693134,
        title: 'Dune: Part Two',
        media_type: 'movie',
        poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s520Hgq.jpg',
        vote_average: 8.2,
        release_date: '2024-02-27',
        genre_ids: [878, 12, 18],
        overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.'
      },
      {
        id: 1022789,
        title: 'Inside Out 2',
        media_type: 'movie',
        poster_path: '/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
        backdrop_path: '/p5ozvmdgsmbWe0H8hkfq4D9mu4P.jpg',
        vote_average: 7.6,
        release_date: '2024-06-11',
        genre_ids: [16, 10751, 35],
        overview: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions!"
      },
      {
        id: 569094,
        title: 'Spider-Man: Across the Spider-Verse',
        media_type: 'movie',
        poster_path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
        backdrop_path: '/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
        vote_average: 8.4,
        release_date: '2023-05-31',
        genre_ids: [16, 28, 12, 878],
        overview: 'Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse.'
      },
      {
        id: 157336,
        title: 'Interstellar',
        media_type: 'movie',
        poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        backdrop_path: '/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
        vote_average: 8.4,
        release_date: '2014-11-05',
        genre_ids: [12, 18, 878],
        overview: 'A group of explorers make use of a newly discovered wormhole to surpass the limitations on human space travel.'
      },
      {
        id: 872585,
        title: 'Oppenheimer',
        media_type: 'movie',
        poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        backdrop_path: '/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg',
        vote_average: 8.1,
        release_date: '2023-07-19',
        genre_ids: [18, 36],
        overview: 'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II.'
      },
      {
        id: 155,
        title: 'The Dark Knight',
        media_type: 'movie',
        poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        backdrop_path: '/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
        vote_average: 8.5,
        release_date: '2008-07-16',
        genre_ids: [18, 28, 80],
        overview: 'Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.'
      },
      {
        id: 27205,
        title: 'Inception',
        media_type: 'movie',
        poster_path: '/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
        backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
        vote_average: 8.4,
        release_date: '2010-07-15',
        genre_ids: [28, 878, 12],
        overview: 'Cobb, a skilled thief who steals corporate secrets through the use of dream-sharing technology.'
      },
      {
        id: 94605,
        name: 'Arcane',
        title: 'Arcane',
        media_type: 'tv',
        poster_path: '/abf8tHg9muGSpCHEvAvjFp21duO.jpg',
        backdrop_path: '/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg',
        vote_average: 8.7,
        first_air_date: '2021-11-06',
        genre_ids: [16, 10765, 18],
        overview: 'Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war.'
      },
      {
        id: 76479,
        name: 'The Boys',
        title: 'The Boys',
        media_type: 'tv',
        poster_path: '/2zm7H4nTh0qRI6Aj44r1i9Y497q.jpg',
        backdrop_path: '/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg',
        vote_average: 8.4,
        first_air_date: '2019-07-26',
        genre_ids: [10765, 28],
        overview: 'A fun and irreverent take on what happens when superheroes abuse their superpowers.'
      },
      {
        id: 66732,
        name: 'Stranger Things',
        title: 'Stranger Things',
        media_type: 'tv',
        poster_path: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
        backdrop_path: '/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
        vote_average: 8.6,
        first_air_date: '2016-07-15',
        genre_ids: [18, 10765, 9648],
        overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments.'
      },
      {
        id: 1396,
        name: 'Breaking Bad',
        title: 'Breaking Bad',
        media_type: 'tv',
        poster_path: '/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
        backdrop_path: '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
        vote_average: 8.9,
        first_air_date: '2008-01-20',
        genre_ids: [18, 80],
        overview: 'Walter White, a New Mexico chemistry teacher, learns he has terminal lung cancer and turns to manufacturing methamphetamine.'
      }
    ];

    if (tab === 'movies') {
      return allTitles.filter(t => t.media_type === 'movie');
    } else if (tab === 'tv') {
      return allTitles.filter(t => t.media_type === 'tv');
    } else if (tab === 'cartoons') {
      return allTitles.filter(t => (t.genre_ids && t.genre_ids.includes(16)));
    }
    return allTitles;
  }

  function applyGenreFilterAndRender() {
    let items = state.currentResults;
    if (state.activeGenre !== 'all') {
      const genreId = parseInt(state.activeGenre, 10);
      items = items.filter(item => {
        if (!item.genre_ids) return false;
        return item.genre_ids.includes(genreId);
      });
    }

    renderMediaGrid(items);
    updatePagination();
  }

  function renderWatchlist() {
    el.loadingState.style.display = 'none';
    updateHeroVisibility(false);
    if (el.continueWatchingSection) el.continueWatchingSection.style.display = 'none';

    const profileName = state.activeProfile ? `${state.activeProfile.name}'s ` : '';
    el.sectionTitle.textContent = `${profileName}Watchlist`;
    el.sectionSubtitle.textContent = `${state.profileWatchlist.length} saved titles ready to stream`;
    el.paginationBar.style.display = 'none';

    if (state.profileWatchlist.length === 0) {
      el.mediaGrid.innerHTML = '';
      el.emptyState.style.display = 'block';
      el.emptyTitle.textContent = 'Your Watchlist is empty';
      el.emptyDesc.textContent = 'Click "Bookmark to Watchlist" on any movie or TV show to save it here.';
      return;
    }

    el.emptyState.style.display = 'none';
    renderMediaGrid(state.profileWatchlist);
  }

  function renderMediaGrid(items) {
    el.mediaGrid.innerHTML = '';

    if (!items || items.length === 0) {
      el.emptyState.style.display = 'block';
      el.emptyTitle.textContent = 'No titles found';
      el.emptyDesc.textContent = 'Try another filter or search keyword.';
      return;
    }

    el.emptyState.style.display = 'none';

    items.forEach(item => {
      const card = createMediaCard(item);
      el.mediaGrid.appendChild(card);
    });
  }

  function createMediaCard(item) {
    const card = document.createElement('div');
    card.className = 'media-card';

    const title = item.title || item.name || 'Untitled';
    const type = item.media_type === 'tv' || item.first_air_date ? 'tv' : 'movie';
    const year = (item.release_date || item.first_air_date || '').slice(0, 4) || '2024';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : '8.0';
    const posterSrc = item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : NO_POSTER_SVG;

    card.innerHTML = `
      <div class="card-poster-wrap">
        <span class="badge-quality">HD</span>
        <span class="badge-rating">&#9733; ${rating}</span>
        <img class="card-poster" src="${posterSrc}" alt="${escapeHTML(title)}" loading="lazy">
        <div class="card-overlay">
          <div class="play-icon-circle">
            <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
        </div>
      </div>
      <div class="card-info">
        <h4 class="card-title" title="${escapeHTML(title)}">${escapeHTML(title)}</h4>
        <div class="card-meta">
          <span>${year}</span>
          <span class="card-type-badge">${type.toUpperCase()}</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      openPlayerModal(item);
    });

    return card;
  }

  function updatePagination() {
    if (state.activeTab === 'watchlist') {
      el.paginationBar.style.display = 'none';
      return;
    }
    el.paginationBar.style.display = 'flex';
    el.pageIndicator.textContent = `Page ${state.currentPage} of ${state.totalPages}`;
    el.prevPageBtn.disabled = state.currentPage <= 1;
    el.nextPageBtn.disabled = state.currentPage >= state.totalPages;
  }

  // --- Video Streaming Player Modal ---
  async function openPlayerModal(item, preferredSeason = 1, preferredEpisode = 1) {
    const id = item.id;
    const type = item.media_type === 'tv' || item.first_air_date ? 'tv' : 'movie';
    const title = item.title || item.name || 'Untitled';

    state.player.id = id;
    state.player.type = type;
    state.player.season = preferredSeason;
    state.player.episode = preferredEpisode;
    state.player.serverIndex = 0;
    state.player.media = item;

    el.modalMediaTitle.textContent = title;
    el.modalMetaTag.textContent = type === 'tv' ? `TV Series • S${preferredSeason} E${preferredEpisode}` : '1080p Full HD';
    el.modalRating.textContent = item.vote_average ? item.vote_average.toFixed(1) : '8.0';
    el.modalYear.textContent = (item.release_date || item.first_air_date || '2024').slice(0, 4);
    el.modalTypeBadge.textContent = type.toUpperCase();
    el.modalOverview.textContent = item.overview || 'No synopsis provided for this title.';

    const posterSrc = item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : NO_POSTER_SVG;
    el.modalPoster.src = posterSrc;

    updateModalWatchlistBtn(item);

    // Show modal immediately
    el.playerModal.classList.add('active');
    el.playerModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Show loader
    el.playerLoader.classList.remove('hidden');

    // Record to watch history
    recordWatchHistory(item, preferredSeason, preferredEpisode);

    // Fetch details (cast, runtime, seasons)
    fetchMediaExtendedDetails(type, id);

    // Resolve streams
    await resolveAndPlayStream();
  }

  async function recordWatchHistory(media, season, episode) {
    if (state.authToken && state.activeProfile) {
      try {
        const data = await fetchAPI(`/api/profiles/${state.activeProfile.id}/history`, {
          method: 'POST',
          body: { media, season, episode }
        });
        state.profileHistory = data.history || [];
        renderContinueWatching();
      } catch (e) {}
    }
  }

  async function resolveAndPlayStream() {
    const { id, type, season, episode } = state.player;
    el.playerLoader.classList.remove('hidden');

    let streamEndpoint = '';
    if (type === 'tv') {
      streamEndpoint = `/api/stream/tv/${id}/${season}/${episode}`;
      el.modalMetaTag.textContent = `TV Series • S${season} E${episode}`;
    } else {
      streamEndpoint = `/api/stream/movie/${id}`;
      el.modalMetaTag.textContent = '1080p Full HD';
    }

    try {
      const data = await fetchAPI(streamEndpoint);
      if (data && data.servers && data.servers.length) {
        state.player.streamSources = data.servers;
      } else {
        throw new Error('No stream servers returned');
      }
    } catch (err) {
      console.warn('Backend stream API fallback:', err.message);
      // Instant client-side fallback to top embed providers
      if (type === 'tv') {
        state.player.streamSources = [
          { name: 'VidSrc (Fast)', url: `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`, speed: 'Fast' },
          { name: 'Embed.su', url: `https://embed.su/embed/tv/${id}/${season}/${episode}`, speed: 'Ultra' },
          { name: 'VidSrc.xyz', url: `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`, speed: 'Standard' },
          { name: 'SuperEmbed', url: `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`, speed: 'Fast' },
          { name: '2Embed', url: `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`, speed: 'Standard' },
          { name: 'VidLink', url: `https://vidlink.pro/tv/${id}/${season}/${episode}`, speed: 'Fast' },
          { name: 'AutoEmbed', url: `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`, speed: 'Fast' }
        ];
      } else {
        state.player.streamSources = [
          { name: 'VidSrc (Fast)', url: `https://vidsrc.to/embed/movie/${id}`, speed: 'Fast' },
          { name: 'Embed.su', url: `https://embed.su/embed/movie/${id}`, speed: 'Ultra' },
          { name: 'VidSrc.xyz', url: `https://vidsrc.xyz/embed/movie/${id}`, speed: 'Standard' },
          { name: 'SuperEmbed', url: `https://multiembed.mov/?video_id=${id}&tmdb=1`, speed: 'Fast' },
          { name: '2Embed', url: `https://www.2embed.cc/embed/${id}`, speed: 'Standard' },
          { name: 'VidLink', url: `https://vidlink.pro/movie/${id}`, speed: 'Fast' },
          { name: 'AutoEmbed', url: `https://player.autoembed.cc/embed/movie/${id}`, speed: 'Fast' }
        ];
      }
    }

    renderServerPills();
    playCurrentServer();
  }

  function renderServerPills() {
    el.serverPills.innerHTML = '';
    state.player.streamSources.forEach((server, idx) => {
      const pill = document.createElement('button');
      pill.className = `server-pill ${idx === state.player.serverIndex ? 'active' : ''}`;
      pill.innerHTML = `
        <span>${escapeHTML(server.name)}</span>
        <span class="server-speed">${server.speed || 'HD'}</span>
      `;
      pill.addEventListener('click', () => {
        if (state.player.serverIndex === idx) return;
        state.player.serverIndex = idx;
        renderServerPills();
        playCurrentServer();
        showToast(`Switched to Server: ${server.name}`);
      });
      el.serverPills.appendChild(pill);
    });
  }

  function playCurrentServer() {
    const server = state.player.streamSources[state.player.serverIndex];
    if (!server || !server.url) return;

    el.playerLoader.classList.remove('hidden');
    el.modalExternalBtn.onclick = () => {
      window.open(server.url, '_blank', 'noopener,noreferrer');
    };

    el.videoIframe.src = server.url;
    el.videoIframe.onload = () => {
      setTimeout(() => el.playerLoader.classList.add('hidden'), 500);
    };
    setTimeout(() => el.playerLoader.classList.add('hidden'), 2500);
  }

  async function fetchMediaExtendedDetails(type, id) {
    try {
      const details = await fetchAPI(`/api/details/${type}/${id}`);

      // Genres
      if (details.genres && details.genres.length) {
        el.modalGenres.innerHTML = details.genres
          .map(g => `<span class="genre-tag">${escapeHTML(g.name)}</span>`)
          .join('');
      }

      // Runtime
      if (details.runtime) {
        el.modalRuntime.textContent = `${details.runtime} min`;
        el.modalRuntime.style.display = 'inline-block';
      } else if (details.number_of_seasons) {
        el.modalRuntime.textContent = `${details.number_of_seasons} Seasons`;
        el.modalRuntime.style.display = 'inline-block';
      } else {
        el.modalRuntime.style.display = 'none';
      }

      // Cast
      if (details.credits && details.credits.cast && details.credits.cast.length) {
        const topCast = details.credits.cast.slice(0, 10);
        el.modalCastList.innerHTML = topCast.map(actor => {
          const avatarUrl = actor.profile_path
            ? `${TMDB_IMAGE_BASE}${actor.profile_path}`
            : 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><circle cx="25" cy="20" r="12" fill="%23444"/><circle cx="25" cy="46" r="20" fill="%23444"/></svg>';
          return `
            <div class="cast-item">
              <img class="cast-avatar" src="${avatarUrl}" alt="${escapeHTML(actor.name)}" loading="lazy">
              <div class="cast-name" title="${escapeHTML(actor.name)}">${escapeHTML(actor.name)}</div>
              <div class="cast-character" title="${escapeHTML(actor.character || '')}">${escapeHTML(actor.character || '')}</div>
            </div>
          `;
        }).join('');
      } else {
        el.modalCastList.innerHTML = '<span style="color: var(--text-muted); font-size: 0.8rem;">Cast information unavailable</span>';
      }

      // TV Season picker
      if (type === 'tv') {
        el.tvEpisodesSection.style.display = 'block';
        setupTvSeasons(details);
      } else {
        el.tvEpisodesSection.style.display = 'none';
      }
    } catch (err) {
      console.warn('Could not fetch extended details:', err);
    }
  }

  function setupTvSeasons(tvDetails) {
    const seasons = (tvDetails.seasons || []).filter(s => s.season_number > 0);
    el.seasonSelect.innerHTML = '';

    if (seasons.length === 0) {
      const opt = document.createElement('option');
      opt.value = 1;
      opt.textContent = 'Season 1';
      el.seasonSelect.appendChild(opt);
    } else {
      seasons.forEach(season => {
        const opt = document.createElement('option');
        opt.value = season.season_number;
        opt.textContent = `${season.name || `Season ${season.season_number}`} (${season.episode_count || '?'} eps)`;
        if (season.season_number === state.player.season) {
          opt.selected = true;
        }
        el.seasonSelect.appendChild(opt);
      });
    }

    el.seasonSelect.onchange = (e) => {
      const selectedSeason = parseInt(e.target.value, 10);
      state.player.season = selectedSeason;
      loadSeasonEpisodes(state.player.id, selectedSeason);
    };

    loadSeasonEpisodes(state.player.id, state.player.season);
  }

  async function loadSeasonEpisodes(tvId, seasonNum) {
    el.episodeCountText.textContent = `Loading Season ${seasonNum} episodes...`;
    el.episodesChipsGrid.innerHTML = '';

    try {
      const data = await fetchAPI(`/api/tv/${tvId}/season/${seasonNum}`);
      const episodes = data.episodes || [];
      el.episodeCountText.textContent = `${episodes.length} Episodes available`;

      episodes.forEach(ep => {
        const chip = document.createElement('button');
        const isActive = ep.episode_number === state.player.episode;
        chip.className = `episode-chip ${isActive ? 'active' : ''}`;
        chip.title = `${ep.episode_number}. ${ep.name || ''}`;
        chip.innerHTML = `<strong>E${ep.episode_number}</strong>: ${escapeHTML(ep.name || `Episode ${ep.episode_number}`)}`;

        chip.addEventListener('click', () => {
          if (state.player.episode === ep.episode_number) return;
          state.player.episode = ep.episode_number;

          const chips = el.episodesChipsGrid.querySelectorAll('.episode-chip');
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');

          resolveAndPlayStream();
          recordWatchHistory(state.player.media, state.player.season, state.player.episode);
          showToast(`Now playing: Episode ${ep.episode_number}`);
        });

        el.episodesChipsGrid.appendChild(chip);
      });
    } catch (err) {
      console.warn('Could not load season episodes:', err);
      el.episodeCountText.textContent = 'Episodes list fallback';
      for (let i = 1; i <= 10; i++) {
        const chip = document.createElement('button');
        const isActive = i === state.player.episode;
        chip.className = `episode-chip ${isActive ? 'active' : ''}`;
        chip.textContent = `Episode ${i}`;
        chip.addEventListener('click', () => {
          state.player.episode = i;
          resolveAndPlayStream();
        });
        el.episodesChipsGrid.appendChild(chip);
      }
    }
  }

  function closePlayerModal() {
    el.playerModal.classList.remove('active');
    el.playerModal.setAttribute('aria-hidden', 'true');
    el.videoIframe.src = '';
    document.body.style.overflow = '';
  }

  // --- Real-Time Search & Autocomplete ---
  let searchDebounceTimer = null;

  function handleSearchInput(e) {
    const query = e.target.value.trim();
    if (query.length > 0) {
      el.searchClearBtn.style.display = 'block';
    } else {
      el.searchClearBtn.style.display = 'none';
      el.searchDropdown.classList.remove('active');
      return;
    }

    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(async () => {
      try {
        const data = await fetchAPI(`/api/search?q=${encodeURIComponent(query)}`);
        const results = (data && data.results) ? data.results.slice(0, 6) : [];

        if (results.length === 0) {
          el.searchDropdown.innerHTML = '<div class="search-no-results">No movies or TV shows found</div>';
        } else {
          el.searchDropdown.innerHTML = results.map(item => {
            const title = item.title || item.name || 'Untitled';
            const year = (item.release_date || item.first_air_date || '').slice(0, 4);
            const type = item.media_type === 'tv' ? 'TV' : 'Movie';
            const poster = item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : NO_POSTER_SVG;
            return `
              <div class="search-item" data-id="${item.id}" data-type="${item.media_type || (item.first_air_date ? 'tv' : 'movie')}">
                <img src="${poster}" alt="${escapeHTML(title)}">
                <div class="search-item-info">
                  <div class="search-item-title">${escapeHTML(title)}</div>
                  <div class="search-item-meta">
                    <span>${type}</span>
                    <span>•</span>
                    <span>${year}</span>
                    <span>•</span>
                    <span style="color: var(--gold-star)">&#9733; ${(item.vote_average || 7.5).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('');

          el.searchDropdown.querySelectorAll('.search-item').forEach((elem, index) => {
            elem.addEventListener('click', () => {
              el.searchDropdown.classList.remove('active');
              openPlayerModal(results[index]);
            });
          });
        }
        el.searchDropdown.classList.add('active');
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 320);
  }

  function performFullSearch(query) {
    if (!query) return;
    el.searchDropdown.classList.remove('active');
    state.activeTab = 'search';
    state.searchQuery = query;
    setActiveNavLink(null);
    loadCatalog(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setActiveNavLink(tab) {
    el.navLinks.forEach(link => {
      const match = link.getAttribute('data-tab') === tab;
      link.classList.toggle('active', match);
    });
  }

  function handleNavClick(tab) {
    if (tab === 'profile') {
      showProfileView();
      return;
    }

    hideProfileView();
    state.activeTab = tab;
    state.currentPage = 1;
    state.activeGenre = 'all';

    el.genreFilterPills.querySelectorAll('.filter-pill').forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-genre') === 'all');
    });

    setActiveNavLink(tab);
    el.mobileDrawer.classList.remove('open');
    el.mobileMenuBtn.classList.remove('open');
    loadCatalog(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // --- Initialize Event Listeners ---
  function initEventListeners() {
    // Brand Logo
    el.brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      handleNavClick('trending');
    });

    // Nav Links
    el.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.getAttribute('data-tab');
        handleNavClick(tab);
      });
    });

    // Mobile Drawer
    el.mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = el.mobileDrawer.classList.toggle('open');
      el.mobileMenuBtn.classList.toggle('open', isOpen);
    });

    // Search Controls
    el.searchInput.addEventListener('input', handleSearchInput);
    el.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performFullSearch(el.searchInput.value.trim());
      } else if (e.key === 'Escape') {
        el.searchDropdown.classList.remove('active');
      }
    });

    el.searchClearBtn.addEventListener('click', () => {
      el.searchInput.value = '';
      el.searchClearBtn.style.display = 'none';
      el.searchDropdown.classList.remove('active');
      el.searchInput.focus();
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-box')) {
        el.searchDropdown.classList.remove('active');
      }
      if (!e.target.closest('.user-profile-menu')) {
        closeDropdown();
      }
      if (!e.target.closest('#mobileDrawer') && !e.target.closest('#mobileMenuBtn')) {
        el.mobileDrawer.classList.remove('open');
        el.mobileMenuBtn.classList.remove('open');
      }
    });

    // Profile Dropdown Toggle
    el.navProfilePillBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      el.navUserProfileMenu.classList.toggle('open');
    });

    el.menuSwitchProfileBtn.addEventListener('click', () => {
      closeDropdown();
      openProfilesScreen();
    });

    el.menuManageProfilesBtn.addEventListener('click', () => {
      closeDropdown();
      openProfilesScreen();
      // Enter manage mode directly
      state.isManageProfilesMode = true;
      el.profilesScreen.classList.add('manage-mode');
      el.profilesHeading.textContent = 'Manage Profiles:';
      el.manageProfilesToggleBtn.style.display = 'none';
      el.manageProfilesDoneBtn.style.display = 'inline-block';
    });

    el.menuAccountHubBtn.addEventListener('click', () => {
      closeDropdown();
      openAccountHubModal();
    });

    el.menuSignOutBtn.addEventListener('click', () => {
      signOut(true);
    });

    // Netflix Screen Controls
    el.manageProfilesToggleBtn.addEventListener('click', () => {
      state.isManageProfilesMode = true;
      el.profilesScreen.classList.add('manage-mode');
      el.profilesHeading.textContent = 'Manage Profiles:';
      el.manageProfilesToggleBtn.style.display = 'none';
      el.manageProfilesDoneBtn.style.display = 'inline-block';
    });

    el.manageProfilesDoneBtn.addEventListener('click', () => {
      state.isManageProfilesMode = false;
      el.profilesScreen.classList.remove('manage-mode');
      el.profilesHeading.textContent = "Who's watching?";
      el.manageProfilesToggleBtn.style.display = 'inline-block';
      el.manageProfilesDoneBtn.style.display = 'none';
    });

    el.profilesSwitchAccountBtn.addEventListener('click', () => {
      closeProfilesScreen();
      openAuthModal('login');
    });

    el.profilesBrowseGuestBtn.addEventListener('click', () => {
      closeProfilesScreen();
      showToast('Browsing Aurora as Guest');
    });

    // Account Hub Modal Controls
    el.accountHubCloseBtn.addEventListener('click', closeAccountHubModal);
    el.accountHubModal.addEventListener('click', (e) => {
      if (e.target === el.accountHubModal) closeAccountHubModal();
    });
    el.hubAddProfileBtn.addEventListener('click', () => {
      closeAccountHubModal();
      openProfileEditModal(null);
    });
    el.hubSwitchWhoBtn.addEventListener('click', () => {
      closeAccountHubModal();
      openProfilesScreen();
    });
    el.hubSignOutBtn.addEventListener('click', () => {
      closeAccountHubModal();
      signOut(true);
    });

    // Auth Buttons
    el.navSignInBtn.addEventListener('click', () => openAuthModal('login'));
    if (el.mobileSignInBtn) {
      el.mobileSignInBtn.addEventListener('click', () => {
        el.mobileDrawer.classList.remove('open');
        openAuthModal('login');
      });
    }

    el.guestBrowseBtn.addEventListener('click', () => {
      closeAuthModal();
      showToast('Welcome! Browsing Aurora as Guest');
    });

    el.authCloseBtn.addEventListener('click', closeAuthModal);
    el.authModal.addEventListener('click', (e) => {
      if (e.target === el.authModal) closeAuthModal();
    });

    el.tabSignIn.addEventListener('click', () => setAuthModalMode('login'));
    el.tabSignUp.addEventListener('click', () => setAuthModalMode('register'));
    el.authSwitchLink.addEventListener('click', () => {
      setAuthModalMode(state.authMode === 'login' ? 'register' : 'login');
    });

    el.authForm.addEventListener('submit', handleAuthSubmit);

    // Profile Edit Modal Controls
    el.profileEditCloseBtn.addEventListener('click', closeProfileEditModal);
    el.cancelProfileBtn.addEventListener('click', closeProfileEditModal);
    el.saveProfileBtn.addEventListener('click', handleSaveProfile);
    el.profileEditModal.addEventListener('click', (e) => {
      if (e.target === el.profileEditModal) closeProfileEditModal();
    });

    // Genre Filters
    el.genreFilterPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;
      const genre = pill.getAttribute('data-genre');
      state.activeGenre = genre;

      el.genreFilterPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      applyGenreFilterAndRender();
    });

    // Pagination
    el.prevPageBtn.addEventListener('click', () => {
      if (state.currentPage > 1) {
        loadCatalog(state.currentPage - 1);
        window.scrollTo({ top: el.mediaGrid.offsetTop - 120, behavior: 'smooth' });
      }
    });

    el.nextPageBtn.addEventListener('click', () => {
      if (state.currentPage < state.totalPages) {
        loadCatalog(state.currentPage + 1);
        window.scrollTo({ top: el.mediaGrid.offsetTop - 120, behavior: 'smooth' });
      }
    });

    el.emptyResetBtn.addEventListener('click', () => {
      handleNavClick('trending');
    });

    // Starter Welcome Screen Controls (Image 2 Reference)
    if (el.starterEnterBtn) {
      el.starterEnterBtn.addEventListener('click', () => {
        hideStarterScreen();
        if (state.currentUser && !state.activeProfile) {
          openProfilesScreen();
        } else if (!state.currentUser) {
          showToast('Welcome to Aurora Cinema! Enjoy high quality streaming.');
        }
      });
    }

    if (el.starterExploreBtn) {
      el.starterExploreBtn.addEventListener('click', () => {
        openBrochureModal();
      });
    }

    if (el.starterSignInBtn) {
      el.starterSignInBtn.addEventListener('click', () => {
        openStarterAuth('login');
      });
    }

    if (el.starterMemberAccessBtn) {
      el.starterMemberAccessBtn.addEventListener('click', () => {
        openStarterAuth('login');
      });
    }

    if (el.starterAuthCloseBtn) {
      el.starterAuthCloseBtn.addEventListener('click', closeStarterAuth);
    }

    if (el.starterTabSignIn) {
      el.starterTabSignIn.addEventListener('click', () => setStarterAuthMode('login'));
    }

    if (el.starterTabSignUp) {
      el.starterTabSignUp.addEventListener('click', () => setStarterAuthMode('register'));
    }

    if (el.starterGuestLink) {
      el.starterGuestLink.addEventListener('click', () => {
        closeStarterAuth();
        hideStarterScreen();
        showToast('Browsing Aurora Cinema as Guest');
      });
    }

    if (el.starterAuthForm) {
      el.starterAuthForm.addEventListener('submit', handleStarterAuthSubmit);
    }

    // Cinema Explore Brochure Modal Controls
    if (el.brochureCloseBtn) {
      el.brochureCloseBtn.addEventListener('click', closeBrochureModal);
    }
    if (el.brochureModal) {
      el.brochureModal.addEventListener('click', (e) => {
        if (e.target === el.brochureModal) closeBrochureModal();
      });
    }
    if (el.brochureEnterBtn) {
      el.brochureEnterBtn.addEventListener('click', () => {
        closeBrochureModal();
        hideStarterScreen();
        if (state.currentUser && !state.activeProfile) {
          openProfilesScreen();
        } else {
          showToast('Welcome to Aurora Cinema!');
        }
      });
    }
    if (el.brochureSignInBtn) {
      el.brochureSignInBtn.addEventListener('click', () => {
        closeBrochureModal();
        openStarterAuth('login');
      });
    }

    // Profile View Menu Cards (Image 3 Reference)
    if (el.menuOpenProfileViewBtn) {
      el.menuOpenProfileViewBtn.addEventListener('click', () => {
        closeDropdown();
        showProfileView();
      });
    }

    if (el.profileMenuWatchlist) {
      el.profileMenuWatchlist.addEventListener('click', () => {
        handleNavClick('watchlist');
      });
    }

    if (el.profileMenuHistory) {
      el.profileMenuHistory.addEventListener('click', () => {
        hideProfileView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast('Loaded your Continue Watching queue');
      });
    }

    if (el.profileMenuSwitch) {
      el.profileMenuSwitch.addEventListener('click', () => {
        hideProfileView();
        openProfilesScreen();
      });
    }

    if (el.profileMenuManage) {
      el.profileMenuManage.addEventListener('click', () => {
        hideProfileView();
        openProfilesScreen();
        state.isManageProfilesMode = true;
        el.profilesScreen.classList.add('manage-mode');
        el.profilesHeading.textContent = 'Manage Profiles:';
        el.manageProfilesToggleBtn.style.display = 'none';
        el.manageProfilesDoneBtn.style.display = 'inline-block';
      });
    }

    if (el.profileMenuPlayback) {
      el.profileMenuPlayback.addEventListener('click', () => {
        openAccountHubModal();
      });
    }

    if (el.profileMenuSubscription) {
      el.profileMenuSubscription.addEventListener('click', () => {
        showToast('👑 VIP Membership Active: 4K Ultra HD & All Servers Unlocked');
      });
    }

    if (el.profileMenuAccount) {
      el.profileMenuAccount.addEventListener('click', () => {
        openAccountHubModal();
      });
    }

    if (el.profileMenuSignOut) {
      el.profileMenuSignOut.addEventListener('click', () => {
        signOut(true);
      });
    }

    // Player Modal Controls
    el.modalCloseBtn.addEventListener('click', closePlayerModal);
    el.playerModal.addEventListener('click', (e) => {
      if (e.target === el.playerModal) closePlayerModal();
    });

    el.modalWatchlistBtn.addEventListener('click', () => {
      if (state.player.media) toggleWatchlist(state.player.media);
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (el.brochureModal && el.brochureModal.classList.contains('active')) closeBrochureModal();
        if (el.playerModal.classList.contains('active')) closePlayerModal();
        if (el.authModal.classList.contains('active')) closeAuthModal();
        if (el.starterAuthPanel && el.starterAuthPanel.style.display === 'block') closeStarterAuth();
        if (el.profileEditModal.classList.contains('active')) closeProfileEditModal();
        if (el.accountHubModal.classList.contains('active')) closeAccountHubModal();
        if (el.profilesScreen.style.display === 'flex' && state.activeProfile) closeProfilesScreen();
      }
      if (e.key === '/' && document.activeElement !== el.searchInput && !el.authModal.classList.contains('active')) {
        e.preventDefault();
        el.searchInput.focus();
      }
    });

    // Sticky Navbar
    window.addEventListener('scroll', updateNavbarBackground, { passive: true });
    updateNavbarBackground();
  }

  // --- Initial Launch ---
  async function init() {
    initEventListeners();
    await checkAuthSession();
    loadCatalog(1);
    console.log('%c🎬 Aurora Streaming Platform with Netflix Profiles active!', 'color: #E50914; font-size: 14px; font-weight: bold;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
