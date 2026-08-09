/**
 * AUTONOMY WALKS - MAIN CONTROLLER (KINFOLK EDITION)
 * Clean State Architecture, Interactive Hero Switcher & Auth-Gated Likes
 */

class AppState {
  constructor() {
    this.STORAGE_KEY = 'autonomy_walks_data_v6';
    this.LIKES_KEY = 'autonomy_walks_user_likes_v6';
    this.BOOKMARKS_KEY = 'autonomy_walks_bookmarks_v6';
    this.VOTED_POLLS_KEY = 'autonomy_walks_voted_polls_v6';
    this.AUTH_USER_KEY = 'autonomy_walks_auth_user_v6';

    this.data = this.loadData();
    this.userLikes = JSON.parse(localStorage.getItem(this.LIKES_KEY) || '{}');
    this.userBookmarks = JSON.parse(localStorage.getItem(this.BOOKMARKS_KEY) || '[]');
    this.userVotedPolls = JSON.parse(localStorage.getItem(this.VOTED_POLLS_KEY) || '{}');
    this.currentUser = JSON.parse(localStorage.getItem(this.AUTH_USER_KEY) || 'null');

    // Active Hero Story Index
    this.activeHeroIndex = 0;

    // Pending like target for deferred fulfillment upon login
    this.pendingLikeTarget = null;

    // Podcast Player state
    this.currentPodcastIndex = 0;
    this.isPlayingPodcast = false;
    this.podcastProgressSec = 0;
    this.podcastTimer = null;

    // Active modal IDs
    this.activeArticleId = null;
    this.activeAuctionId = null;
    this.activePaperId = null;
    this.activeScholarshipId = null;
  }

  loadData() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading from localStorage, using default data:', e);
    }
    const seed = typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : {};
    this.saveData(seed);
    return JSON.parse(JSON.stringify(seed));
  }

  saveData(data = this.data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving data to localStorage:', e);
    }
  }

  resetToDemoData() {
    if (typeof DEFAULT_DATA !== 'undefined') {
      this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      this.saveData(this.data);
    }
  }

  // Authentication Status
  isAuthenticated() {
    return this.currentUser !== null && typeof this.currentUser === 'object' && !!this.currentUser.email;
  }

  login(email, password, name = null) {
    const displayName = name || email.split('@')[0];
    const user = {
      email,
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      joinedDate: new Date().toLocaleDateString()
    };
    this.currentUser = user;
    localStorage.setItem(this.AUTH_USER_KEY, JSON.stringify(user));
    return user;
  }

  signup(name, email, password) {
    const user = {
      email,
      name: name || 'Reader',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      joinedDate: new Date().toLocaleDateString()
    };
    this.currentUser = user;
    localStorage.setItem(this.AUTH_USER_KEY, JSON.stringify(user));
    return user;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem(this.AUTH_USER_KEY);
  }

  // Strict Auth-Gated Likes
  toggleLike(id, type = 'article') {
    if (!this.isAuthenticated()) {
      return false;
    }

    const isLiked = !!this.userLikes[id];
    if (isLiked) {
      delete this.userLikes[id];
    } else {
      this.userLikes[id] = true;
    }
    localStorage.setItem(this.LIKES_KEY, JSON.stringify(this.userLikes));

    let target = null;
    if (type === 'article') {
      target = (this.data.articles || []).find(a => a.id === id) || (this.data.scienceTech || []).find(s => s.id === id);
    } else if (type === 'campaign') {
      target = (this.data.campaigns || []).find(c => c.id === id);
    }

    if (target) {
      target.likes += isLiked ? -1 : 1;
      if (target.likes < 0) target.likes = 0;
      this.saveData();
    }

    return !isLiked;
  }

  isLiked(id) {
    return !!this.userLikes[id];
  }

  toggleBookmark(id, title, type = 'Article') {
    const index = this.userBookmarks.findIndex(b => b.id === id);
    let bookmarked = false;
    if (index >= 0) {
      this.userBookmarks.splice(index, 1);
      bookmarked = false;
    } else {
      this.userBookmarks.push({ id, title, type, date: new Date().toLocaleDateString() });
      bookmarked = true;
    }
    localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(this.userBookmarks));
    return bookmarked;
  }

  isBookmarked(id) {
    return this.userBookmarks.some(b => b.id === id);
  }

  addArticleComment(articleId, author, email, text) {
    const article = (this.data.articles || []).find(a => a.id === articleId);
    if (!article) return null;
    if (!article.comments) article.comments = [];
    const newComment = {
      name: author,
      text: text,
      time: 'Just now'
    };
    article.comments.unshift(newComment);
    this.saveData();
    return newComment;
  }

  placeAuctionBid(auctionId, bidderName, bidAmount) {
    const auction = (this.data.auctions || []).find(a => a.id === auctionId);
    if (!auction) return { success: false, message: 'Auction not found' };

    const amount = Number(bidAmount);
    if (amount <= auction.currentBid) {
      return { success: false, message: `Your bid must be higher than current bid (₹ ${auction.currentBid.toLocaleString('en-IN')})` };
    }

    auction.currentBid = amount;
    auction.totalBids += 1;
    if (!auction.bidHistory) auction.bidHistory = [];
    auction.bidHistory.unshift({
      bidder: bidderName,
      amount: amount,
      time: 'Just now'
    });

    this.saveData();
    return { success: true, message: `Bid of ₹ ${amount.toLocaleString('en-IN')} placed successfully!`, auction };
  }

  votePoll(pollId, optionIndex) {
    if (this.userVotedPolls[pollId] !== undefined) {
      return { success: false, message: 'You have already voted in this poll.' };
    }

    const poll = (this.data.polls || []).find(p => p.id === pollId);
    if (!poll || !poll.options[optionIndex]) {
      return { success: false, message: 'Invalid poll option.' };
    }

    poll.options[optionIndex].votes += 1;
    poll.totalVotes += 1;
    this.userVotedPolls[pollId] = optionIndex;
    localStorage.setItem(this.VOTED_POLLS_KEY, JSON.stringify(this.userVotedPolls));
    this.saveData();
    return { success: true, message: 'Your vote has been counted!', poll };
  }
}

// Global App Instance
var app = new AppState();
window.app = app;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initUI();
  updateAuthUI();
  renderAllSections();
  initAuctionTimerTicker();
  initPodcastPlayer();
  initAdminTabs();
  initAuthModalHandlers();
  initEventHandlers();
});

function initUI() {
  const dateElem = document.getElementById('currentDateDisplay');
  if (dateElem) {
    const options = { month: 'short', year: 'numeric' };
    dateElem.textContent = 'Issue 59 • ' + new Date().toLocaleDateString('en-US', options);
  }
  updateBookmarksBadge();
}

function updateBookmarksBadge() {
  const badge = document.getElementById('bookmarksCountBadge');
  if (badge) {
    badge.textContent = app.userBookmarks.length;
  }
  const menuBadge = document.getElementById('menuBookmarksBadge');
  if (menuBadge) {
    menuBadge.textContent = app.userBookmarks.length;
  }
}

// Update Header & Fullscreen Menu Auth State
function updateAuthUI() {
  const isAuth = app.isAuthenticated();
  const signedOutDesktop = document.getElementById('authSignedOutState');
  const signedInDesktop = document.getElementById('authSignedInState');
  const menuAuthText = document.getElementById('menuAuthBtnText');

  if (isAuth && app.currentUser) {
    if (signedOutDesktop) signedOutDesktop.style.display = 'none';
    if (signedInDesktop) {
      signedInDesktop.style.display = 'flex';
      const nameElem = document.getElementById('navUserName');
      const avatarElem = document.getElementById('navUserAvatar');
      if (nameElem) nameElem.textContent = app.currentUser.name;
      if (avatarElem) avatarElem.src = app.currentUser.avatar;
    }
    if (menuAuthText) {
      menuAuthText.textContent = `Signed in as ${app.currentUser.name}`;
    }
  } else {
    if (signedOutDesktop) signedOutDesktop.style.display = 'flex';
    if (signedInDesktop) signedInDesktop.style.display = 'none';
    if (menuAuthText) {
      menuAuthText.textContent = 'Sign In / Create Account';
    }
  }
}

// Kinfolk Fullscreen Menu Handlers (Two Lines Button)
window.openKinfolkMenu = function() {
  const overlay = document.getElementById('kinfolkMenuOverlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeKinfolkMenu = function() {
  const overlay = document.getElementById('kinfolkMenuOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.openSearchModal = function() {
  const modal = document.getElementById('searchModal');
  if (modal) {
    modal.classList.add('active');
    setTimeout(() => document.getElementById('searchKeywordInput')?.focus(), 100);
  }
};

window.openBookmarksDrawer = function() {
  const modal = document.getElementById('bookmarksModal');
  if (modal) {
    renderBookmarksList();
    modal.classList.add('active');
  }
};

window.openAllArticlesDrawer = function() {
  const section = document.getElementById('editorial-series');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

// Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
      ${type === 'success' 
        ? '<polyline points="20 6 9 17 4 12"/>' 
        : type === 'error' 
        ? '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
        : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'}
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Open Auth Modal
window.openAuthModal = function(mode = 'signin', promptMsg = null) {
  const modal = document.getElementById('authModal');
  const subtitle = document.getElementById('authModalSubtitle');
  const tabSignIn = document.getElementById('tabBtnSignIn');
  const tabSignUp = document.getElementById('tabBtnSignUp');
  const formSignIn = document.getElementById('signInForm');
  const formSignUp = document.getElementById('signUpForm');

  if (promptMsg && subtitle) {
    subtitle.textContent = promptMsg;
  } else if (subtitle) {
    subtitle.textContent = 'Sign in to like stories, participate in discussions, and join civic polls.';
  }

  if (mode === 'signup') {
    tabSignIn?.classList.remove('active');
    tabSignUp?.classList.add('active');
    formSignIn?.classList.remove('active');
    formSignUp?.classList.add('active');
  } else {
    tabSignIn?.classList.add('active');
    tabSignUp?.classList.remove('active');
    formSignIn?.classList.add('active');
    formSignUp?.classList.remove('active');
  }

  modal?.classList.add('active');
};

function initAuthModalHandlers() {
  const tabSignIn = document.getElementById('tabBtnSignIn');
  const tabSignUp = document.getElementById('tabBtnSignUp');
  const formSignIn = document.getElementById('signInForm');
  const formSignUp = document.getElementById('signUpForm');
  const modal = document.getElementById('authModal');
  const closeBtn = document.getElementById('closeAuthModalBtn');

  tabSignIn?.addEventListener('click', (e) => {
    e.preventDefault();
    tabSignIn.classList.add('active');
    tabSignUp?.classList.remove('active');
    formSignIn?.classList.add('active');
    formSignUp?.classList.remove('active');
  });

  tabSignUp?.addEventListener('click', (e) => {
    e.preventDefault();
    tabSignUp.classList.add('active');
    tabSignIn?.classList.remove('active');
    formSignUp?.classList.add('active');
    formSignIn?.classList.remove('active');
  });

  closeBtn?.addEventListener('click', () => {
    modal?.classList.remove('active');
    app.pendingLikeTarget = null;
  });

  // Sign In Form Submit
  formSignIn?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value;

    const user = app.login(email, pass);
    updateAuthUI();
    modal?.classList.remove('active');
    showToast(`Welcome back, ${user.name}!`, 'success');

    // Fulfill pending like if any
    if (app.pendingLikeTarget) {
      const { id, type } = app.pendingLikeTarget;
      app.toggleLike(id, type);
      renderArticles();
      renderCampaigns(document.querySelector('.filter-tab-btn.active')?.dataset.filter || 'all');
      if (app.activeArticleId === id) updateReaderModalLikeBtn();
      showToast('Liked post ❤️', 'success');
      app.pendingLikeTarget = null;
    }
  });

  // Sign Up Form Submit
  formSignUp?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const pass = document.getElementById('signupPassword').value;

    const user = app.signup(name, email, pass);
    updateAuthUI();
    modal?.classList.remove('active');
    showToast(`Welcome to Autonomy Walks, ${user.name}!`, 'success');

    if (app.pendingLikeTarget) {
      const { id, type } = app.pendingLikeTarget;
      app.toggleLike(id, type);
      renderArticles();
      renderCampaigns(document.querySelector('.filter-tab-btn.active')?.dataset.filter || 'all');
      if (app.activeArticleId === id) updateReaderModalLikeBtn();
      showToast('Liked post ❤️', 'success');
      app.pendingLikeTarget = null;
    }
  });

  // Sign Out Handlers
  const handleSignOut = () => {
    app.logout();
    updateAuthUI();
    renderArticles();
    renderCampaigns(document.querySelector('.filter-tab-btn.active')?.dataset.filter || 'all');
    showToast('Signed out successfully', 'info');
  };

  document.getElementById('headerSignOutBtn')?.addEventListener('click', handleSignOut);
  document.getElementById('mobileSignOutBtn')?.addEventListener('click', handleSignOut);

  // Trigger buttons
  document.getElementById('headerSignInBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    openAuthModal('signin');
  });
  
  document.getElementById('headerSignUpBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    openAuthModal('signup');
  });
  
  document.getElementById('mobileSignInBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('mobileNavDrawer')?.classList.remove('active');
    openAuthModal('signin');
  });

  document.getElementById('mobileSignUpBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('mobileNavDrawer')?.classList.remove('active');
    openAuthModal('signup');
  });
}

// Render All Sections
function renderAllSections() {
  renderHeroStories();
  renderArticles();
  renderThoughtStarters();
  renderCampaigns('all');
  renderAuctions();
  renderPodcastPlaylist();
  renderPolls();
  renderResearchPapers();
  renderScienceTech();
  renderComicSeries();
  renderScholarships();
  renderAdminTable();
}

// ==========================================
// 01. KINFOLK HERO & INTERACTIVE STORIES SWITCHER (PDF Page 3 & 8)
// ==========================================
function renderHeroStories() {
  const container = document.getElementById('heroStoriesList');
  const stories = app.data.heroStories || [];
  if (!container || stories.length === 0) return;

  container.innerHTML = stories.map((s, idx) => `
    <div class="hero-story-item ${idx === app.activeHeroIndex ? 'active' : ''}" onclick="selectHeroStory(${idx})">
      <span class="hero-story-cat">${s.category}</span>
      <span class="hero-story-title">${s.title}</span>
    </div>
  `).join('');

  // Update current hero visual
  const current = stories[app.activeHeroIndex];
  if (current) {
    const bgImg = document.getElementById('heroBackdropImg');
    const kicker = document.getElementById('heroKickerTag');
    const title = document.getElementById('heroTitle');
    const subtitle = document.getElementById('heroSubtitle');

    if (bgImg) bgImg.src = current.image;
    if (kicker) kicker.textContent = current.kicker;
    if (title) title.textContent = current.title;
    if (subtitle) subtitle.textContent = current.subtitle;
  }
}

window.selectHeroStory = function(idx) {
  const stories = app.data.heroStories || [];
  if (!stories[idx]) return;

  app.activeHeroIndex = idx;
  renderHeroStories();
};

// ==========================================
// 02. EDITORIAL SERIES / 5-COLUMN PORTRAIT GRID (PDF Pages 4 & 6)
// ==========================================
function renderArticles() {
  const container = document.getElementById('articlesGrid');
  if (!container) return;

  const articles = app.data.articles || [];
  container.innerHTML = articles.map(art => {
    const isLiked = app.isLiked(art.id);
    return `
      <article class="editorial-card" onclick="openArticleReader('${art.id}')">
        <div class="editorial-media-box">
          <img src="${art.image}" alt="${art.title}" loading="lazy">
        </div>
        <div class="editorial-meta-top">${art.category}, ${art.issue || 'Issue 59'}</div>
        <h3 class="editorial-card-title">${art.title}</h3>
        <p class="editorial-card-excerpt">${art.excerpt}</p>
        
        <div class="post-action-bar">
          <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="handleLikeArticle('${art.id}', event)" title="${app.isAuthenticated() ? 'Like story' : 'Sign in to like'}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            <span>${art.likes}</span>
          </button>
          <span style="font-size: 0.72rem; color: var(--text-muted); margin-left: auto;">${art.readTime}</span>
        </div>
      </article>
    `;
  }).join('');
}

// Strictly Auth-Gated Like Handler
window.handleLikeArticle = function(id, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  if (!app.isAuthenticated()) {
    app.pendingLikeTarget = { id, type: 'article' };
    openAuthModal('signin', 'Please sign in or create an account to like stories!');
    return;
  }

  const liked = app.toggleLike(id, 'article');
  renderArticles();
  if (app.activeArticleId === id) {
    updateReaderModalLikeBtn();
  }
  showToast(liked ? 'Added to your liked stories ❤️' : 'Removed like');
};

// ==========================================
// 03. THOUGHT STARTERS (PDF Page 7)
// ==========================================
function renderThoughtStarters() {
  const container = document.getElementById('thoughtStartersList');
  if (!container) return;

  const items = app.data.thoughtStarters || [];
  container.innerHTML = items.map(ts => `
    <div class="thought-starter-row" onclick="openArticleReader('${ts.articleId || 'art-1'}')">
      <div class="thought-starter-thumb">
        <img src="${ts.image}" alt="${ts.title}" loading="lazy">
      </div>
      <div>
        <h3 class="thought-starter-title">${ts.title}</h3>
        <p class="thought-starter-subtitle">${ts.subtitle}</p>
      </div>
      <div class="thought-starter-meta">${ts.category}</div>
    </div>
  `).join('');
}

// ==========================================
// 04. POLITICAL CAMPAIGNS (PDF Page 4)
// ==========================================
function renderCampaigns(filter = 'all') {
  const container = document.getElementById('campaignsGrid');
  if (!container) return;

  const campaigns = app.data.campaigns || [];
  const filtered = filter === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.category.toLowerCase() === filter.toLowerCase());

  container.innerHTML = filtered.map(c => {
    const isLiked = app.isLiked(c.id);
    return `
      <div class="campaign-card" onclick="openCampaignDetail('${c.id}')">
        <div class="campaign-img-wrap">
          <img src="${c.image}" alt="${c.title}" loading="lazy">
        </div>
        <span class="category-badge politics" style="font-size: 0.65rem; margin-bottom: 4px;">${c.category}</span>
        <h4 class="campaign-title">${c.title}</h4>
        <p class="campaign-subtitle">${c.subtitle}</p>
        <div class="post-action-bar">
          <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="handleLikeCampaign('${c.id}', event)" title="${app.isAuthenticated() ? 'Like pick' : 'Sign in to like'}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            <span>${c.likes}</span>
          </button>
          <span style="font-size: 0.72rem; color: var(--text-muted); margin-left: auto;">View Pick →</span>
        </div>
      </div>
    `;
  }).join('');
}

window.handleLikeCampaign = function(id, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  if (!app.isAuthenticated()) {
    app.pendingLikeTarget = { id, type: 'campaign' };
    openAuthModal('signin', 'Please sign in or create an account to like campaign picks!');
    return;
  }

  const liked = app.toggleLike(id, 'campaign');
  renderCampaigns(document.querySelector('.filter-tab-btn.active')?.dataset.filter || 'all');
  showToast(liked ? 'Campaign pick liked!' : 'Removed like');
};

window.openCampaignDetail = function(id) {
  const camp = (app.data.campaigns || []).find(c => c.id === id);
  if (!camp) return;
  showToast(`Movement: ${camp.title} — ${camp.description}`, 'info');
};

// ==========================================
// 05. ART AUCTIONS & COUNTDOWN ENGINE
// ==========================================
function renderAuctions() {
  const container = document.getElementById('auctionsGrid');
  if (!container) return;

  const auctions = app.data.auctions || [];
  container.innerHTML = auctions.map(auc => {
    const formattedTimer = formatSecondsToHMS(auc.remainingSeconds);
    return `
      <div class="auction-card" id="auction-card-${auc.id}">
        <div class="auction-media-box">
          <img src="${auc.image}" alt="${auc.title}" loading="lazy">
          <span class="auction-live-pill">LIVE LOT</span>
        </div>
        <h3 class="auction-title">${auc.title}</h3>
        <p class="auction-artist-medium">${auc.medium} • By ${auc.artist}</p>

        <div class="bid-status-box">
          <div class="bid-label">Current Highest Bid</div>
          <div class="bid-amount" id="auc-price-${auc.id}">₹ ${auc.currentBid.toLocaleString('en-IN')}</div>
        </div>

        <div class="auction-countdown-row">
          <span class="countdown-timer" id="auc-timer-${auc.id}">${formattedTimer}</span>
          <span style="color: var(--text-muted);">${auc.totalBids} bids</span>
        </div>

        <button class="btn btn-gold btn-sm" onclick="openBidModal('${auc.id}')" style="width: 100%;">
          <span>Bid Now</span>
        </button>
      </div>
    `;
  }).join('');
}

function formatSecondsToHMS(sec) {
  if (sec <= 0) return '00h 00m 00s (Closed)';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

function initAuctionTimerTicker() {
  setInterval(() => {
    (app.data.auctions || []).forEach(auc => {
      if (auc.remainingSeconds > 0) {
        auc.remainingSeconds -= 1;
        const timerElem = document.getElementById(`auc-timer-${auc.id}`);
        if (timerElem) {
          timerElem.textContent = formatSecondsToHMS(auc.remainingSeconds);
        }
      }
    });

    if (app.activeAuctionId) {
      const activeAuc = (app.data.auctions || []).find(a => a.id === app.activeAuctionId);
      if (activeAuc) {
        const modalTimer = document.getElementById('bidModalTimer');
        if (modalTimer) {
          modalTimer.textContent = formatSecondsToHMS(activeAuc.remainingSeconds);
        }
      }
    }
  }, 1000);
}

// ==========================================
// 06. COMIC SERIES & EDITIONS (PDF Page 9)
// ==========================================
function renderComicSeries() {
  const container = document.getElementById('comicSeriesGrid');
  if (!container) return;

  const items = app.data.comicSeries || [];
  container.innerHTML = items.map(cs => `
    <div class="comic-series-card" onclick="showToast('${cs.tag}: ${cs.title} — ${cs.subtitle}', 'info')">
      <img src="${cs.image}" alt="${cs.title}" loading="lazy">
      <div class="comic-series-overlay"></div>
      <div class="comic-series-content">
        <div class="comic-series-tag">${cs.tag}</div>
        <h3 class="comic-series-title">${cs.title}</h3>
        <span class="comic-series-cta">${cs.ctaText || 'See More'}</span>
      </div>
    </div>
  `).join('');
}

// ==========================================
// 07. PODCAST PLAYER
// ==========================================
function initPodcastPlayer() {
  const playToggleBtn = document.getElementById('podcastPlayToggleBtn');
  const prevBtn = document.getElementById('podcastPrevBtn');
  const nextBtn = document.getElementById('podcastNextBtn');
  const seekerBar = document.getElementById('podcastSeekerBar');

  if (playToggleBtn) playToggleBtn.addEventListener('click', togglePodcastPlay);
  if (prevBtn) prevBtn.addEventListener('click', () => changePodcastEpisode(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => changePodcastEpisode(1));
  if (seekerBar) seekerBar.addEventListener('click', handlePodcastSeek);

  loadCurrentPodcast();
}

function loadCurrentPodcast() {
  const pod = (app.data.podcasts || [])[app.currentPodcastIndex];
  if (!pod) return;

  const cover = document.getElementById('podcastCoverImg');
  const title = document.getElementById('podcastCurrentTitle');
  const host = document.getElementById('podcastCurrentHost');
  const badge = document.getElementById('podcastEpisodeBadge');
  const duration = document.getElementById('podcastDuration');

  if (cover) cover.src = pod.cover;
  if (title) title.textContent = pod.title;
  if (host) host.textContent = pod.host;
  if (badge) badge.textContent = `${pod.episode} • ${pod.duration}`;
  if (duration) duration.textContent = pod.duration;

  renderPodcastPlaylist();
}

function renderPodcastPlaylist() {
  const container = document.getElementById('podcastPlaylistContainer');
  if (!container) return;

  container.innerHTML = (app.data.podcasts || []).map((pod, idx) => `
    <div class="playlist-item ${idx === app.currentPodcastIndex ? 'active' : ''}" onclick="selectPodcast(${idx})">
      <div class="playlist-item-num">${pod.episode} • ${pod.duration}</div>
      <div class="playlist-item-title">${pod.title}</div>
    </div>
  `).join('');
}

window.selectPodcast = function(idx) {
  app.currentPodcastIndex = idx;
  app.podcastProgressSec = 0;
  loadCurrentPodcast();
  if (app.isPlayingPodcast) {
    startPodcastTicker();
  }
};

function togglePodcastPlay() {
  app.isPlayingPodcast = !app.isPlayingPodcast;
  const playSvg = document.getElementById('playIconSvg');

  if (app.isPlayingPodcast) {
    if (playSvg) playSvg.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    startPodcastTicker();
    showToast(`Now Playing: ${(app.data.podcasts || [])[app.currentPodcastIndex].title}`);
  } else {
    if (playSvg) playSvg.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
    clearInterval(app.podcastTimer);
  }
}

function startPodcastTicker() {
  clearInterval(app.podcastTimer);
  app.podcastTimer = setInterval(() => {
    app.podcastProgressSec += 1;
    const fill = document.getElementById('podcastSeekerFill');
    const timeDisplay = document.getElementById('podcastCurrentTime');

    const totalSec = 45 * 60 + 20;
    const pct = Math.min((app.podcastProgressSec / totalSec) * 100, 100);

    if (fill) fill.style.width = `${pct}%`;
    if (timeDisplay) {
      const m = Math.floor(app.podcastProgressSec / 60);
      const s = app.podcastProgressSec % 60;
      timeDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    if (pct >= 100) changePodcastEpisode(1);
  }, 1000);
}

function changePodcastEpisode(dir) {
  const podcasts = app.data.podcasts || [];
  app.currentPodcastIndex += dir;
  if (app.currentPodcastIndex < 0) app.currentPodcastIndex = podcasts.length - 1;
  if (app.currentPodcastIndex >= podcasts.length) app.currentPodcastIndex = 0;
  app.podcastProgressSec = 0;
  loadCurrentPodcast();
  if (app.isPlayingPodcast) startPodcastTicker();
}

function handlePodcastSeek(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const pct = clickX / rect.width;
  app.podcastProgressSec = Math.floor(pct * (45 * 60 + 20));
  const fill = document.getElementById('podcastSeekerFill');
  if (fill) fill.style.width = `${pct * 100}%`;
}

// ==========================================
// 08. OPINION POLLS ENGINE
// ==========================================
function renderPolls() {
  const container = document.getElementById('pollsGrid');
  if (!container) return;

  const polls = app.data.polls || [];
  container.innerHTML = polls.map(poll => {
    const userVoteIdx = app.userVotedPolls[poll.id];
    const hasVoted = userVoteIdx !== undefined;

    const optionsHtml = poll.options.map((opt, idx) => {
      const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
      const isSelected = userVoteIdx === idx;
      return `
        <button class="poll-option-btn ${isSelected ? 'voted' : ''}" onclick="handleVotePoll('${poll.id}', ${idx})" ${hasVoted ? 'disabled' : ''}>
          <div class="poll-option-fill" style="width: ${hasVoted ? pct : 0}%;"></div>
          <span class="poll-option-text">${opt.text} ${isSelected ? '✓' : ''}</span>
          ${hasVoted ? `<span class="poll-option-percent">${pct}%</span>` : ''}
        </button>
      `;
    }).join('');

    return `
      <div class="poll-card" id="poll-${poll.id}">
        <span class="poll-status-tag">${poll.category || 'CITIZEN OPINION'} • ${hasVoted ? 'VOTE RECORDED' : 'OPEN FOR VOTING'}</span>
        <h3 class="poll-question">${poll.question}</h3>
        <div class="poll-options-list">
          ${optionsHtml}
        </div>
        <div class="poll-footer">
          <span>${poll.totalVotes.toLocaleString()} total verified votes</span>
          <span>${hasVoted ? 'Results updated live' : 'Click any option to vote'}</span>
        </div>
      </div>
    `;
  }).join('');
}

window.handleVotePoll = function(pollId, optionIndex) {
  const res = app.votePoll(pollId, optionIndex);
  if (res.success) {
    renderPolls();
    showToast(res.message, 'success');
  } else {
    showToast(res.message, 'info');
  }
};

// ==========================================
// 09. RESEARCH PAPERS ARCHIVE
// ==========================================
function renderResearchPapers() {
  const container = document.getElementById('papersGrid');
  if (!container) return;

  const papers = app.data.researchPapers || [];
  container.innerHTML = papers.map(paper => `
    <div class="paper-card">
      <span class="category-badge research">${paper.category}</span>
      <h3 class="paper-title">${paper.title}</h3>
      <p class="paper-author">By ${paper.author} (${paper.affiliation || 'University'})</p>
      <p class="paper-abstract">${paper.abstract}</p>
      <div class="paper-card-actions">
        <button class="btn btn-outline btn-sm" onclick="openPaperModal('${paper.id}')" style="flex-grow: 1;">
          <span>Read Abstract</span>
        </button>
        <button class="btn btn-primary btn-sm" onclick="downloadPaperPdf('${paper.id}')" title="Download PDF">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

// ==========================================
// 10. SCIENCE & TECHNOLOGY SECTION (The Human Future)
// ==========================================
function renderScienceTech() {
  const container = document.getElementById('scienceTechGrid');
  if (!container) return;

  const items = app.data.scienceTech || [];
  container.innerHTML = items.map(item => {
    const isLiked = app.isLiked(item.id);
    return `
      <article class="science-tech-card" onclick="openArticleReader('${item.id}')">
        <div class="science-tech-media">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
        </div>
        <div class="science-tech-meta">
          <span class="category-badge science">${item.category}</span>
          <span>${item.readTime || '6 min read'}</span>
        </div>
        <h3 class="science-tech-title">${item.title}</h3>
        <p class="science-tech-author">By ${item.author}</p>
        <p class="science-tech-excerpt">${item.excerpt}</p>
        <div class="post-action-bar" style="margin-top: auto; padding-top: 12px;">
          <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="handleLikeArticle('${item.id}', event)" title="${app.isAuthenticated() ? 'Like essay' : 'Sign in to like'}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            <span>${item.likes}</span>
          </button>
          <span style="font-size: 0.72rem; color: var(--text-muted); margin-left: auto;">Read Essay →</span>
        </div>
      </article>
    `;
  }).join('');
}

// ==========================================
// 11. SCHOLARSHIPS
// ==========================================
function renderScholarships() {
  const container = document.getElementById('scholarshipsGrid');
  if (!container) return;

  const scholarships = app.data.scholarships || [];
  container.innerHTML = scholarships.map(sch => `
    <div class="scholarship-card">
      <span class="category-badge" style="color: var(--accent-green); margin-bottom: 8px;">${sch.category}</span>
      <h3 class="scholarship-title">${sch.title}</h3>
      <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 14px; line-height: 1.5;">${sch.description}</p>
      
      <div class="scholarship-detail-row">
        <span style="color: var(--text-muted);">Grant Amount</span>
        <span class="scholarship-amount">${sch.amount}</span>
      </div>
      <div class="scholarship-detail-row">
        <span style="color: var(--text-muted);">Deadline</span>
        <span style="font-weight: 600;">${sch.deadline}</span>
      </div>

      <button class="btn btn-primary btn-sm" onclick="openScholarshipModal('${sch.id}')" style="margin-top: 14px;">
        <span>Apply for Grant</span>
      </button>
    </div>
  `).join('');
}

// ==========================================
// 12. KINFOLK ARTICLE READER MODAL (PDF Pages 11-16)
// ==========================================
window.openArticleReader = function(id) {
  const art = (app.data.articles || []).find(a => a.id === id) || (app.data.scienceTech || []).find(s => s.id === id) || (app.data.articles || [])[0];
  if (!art) return;

  app.activeArticleId = art.id;
  const modal = document.getElementById('readerModal');
  const img = document.getElementById('readerImg');
  const title = document.getElementById('readerTitle');
  const author = document.getElementById('readerAuthor');
  const photographer = document.getElementById('readerPhotographer');
  const stylist = document.getElementById('readerStylist');
  const body = document.getElementById('readerBody');
  const pullQuote = document.getElementById('readerPullQuote');
  const gallery = document.getElementById('readerGalleryGrid');

  if (img) img.src = art.image;
  if (title) title.textContent = art.title;
  if (author) author.textContent = art.author || 'Tara Joshi';
  if (photographer) photographer.textContent = art.photographer || 'Raphaëlle Orphelin';
  if (stylist) stylist.textContent = art.stylist || 'Aartthie Mahakuperan';
  if (pullQuote) pullQuote.textContent = art.quote || '“We believe that journalism and art can speak when institutions fail.”';

  // Paragraphs
  if (body) {
    const paragraphs = (art.content || art.excerpt).split('\n\n');
    body.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
  }

  // Gallery
  if (gallery) {
    const imgs = art.galleryImages || [art.image];
    gallery.innerHTML = imgs.map(gUrl => `<img src="${gUrl}" alt="Editorial spread photo" loading="lazy">`).join('');
  }

  // Comments & Like states
  updateReaderModalLikeBtn();
  renderReaderComments(art);

  if (modal) modal.classList.add('active');
};

function updateReaderModalLikeBtn() {
  const btn = document.getElementById('readerLikeBtn');
  const count = document.getElementById('readerLikesCount');
  if (!btn || !count) return;

  const art = (app.data.articles || []).find(a => a.id === app.activeArticleId) || (app.data.scienceTech || []).find(s => s.id === app.activeArticleId);
  if (!art) return;

  const isLiked = app.isLiked(art.id);
  count.textContent = art.likes;
  if (isLiked) btn.classList.add('liked');
  else btn.classList.remove('liked');
}

function renderReaderComments(art) {
  const commentsList = document.getElementById('readerCommentsList');
  const commentsCount = document.getElementById('readerCommentsCount');
  if (!commentsList) return;

  const comments = art.comments || [];
  if (commentsCount) commentsCount.textContent = comments.length;

  if (comments.length === 0) {
    commentsList.innerHTML = `<div style="color: var(--text-muted); font-size: 0.82rem;">Be the first to share your thoughts on this story.</div>`;
    return;
  }

  commentsList.innerHTML = comments.map(c => `
    <div class="comment-item">
      <div class="comment-author-bar">
        <span>${c.name}</span>
        <span class="comment-time">${c.time}</span>
      </div>
      <p class="comment-text">${c.text}</p>
    </div>
  `).join('');
}

// ==========================================
// 12. LIVE BID MODAL
// ==========================================
window.openBidModal = function(id) {
  const auc = (app.data.auctions || []).find(a => a.id === id);
  if (!auc) return;

  app.activeAuctionId = id;
  const modal = document.getElementById('bidModal');
  const title = document.getElementById('bidModalArtworkTitle');
  const img = document.getElementById('bidModalArtworkImg');
  const artist = document.getElementById('bidModalArtist');
  const medium = document.getElementById('bidModalMedium');
  const timer = document.getElementById('bidModalTimer');
  const curBid = document.getElementById('bidModalCurrentBid');
  const minBid = document.getElementById('bidModalMinBid');
  const amountInput = document.getElementById('bidAmountInput');
  const bidderInput = document.getElementById('bidderNameInput');

  if (title) title.textContent = `Lot: ${auc.title}`;
  if (img) img.src = auc.image;
  if (artist) artist.textContent = `Artist: ${auc.artist}`;
  if (medium) medium.textContent = auc.medium;
  if (timer) timer.textContent = formatSecondsToHMS(auc.remainingSeconds);
  if (curBid) curBid.textContent = `₹ ${auc.currentBid.toLocaleString('en-IN')}`;
  
  if (app.currentUser && bidderInput) {
    bidderInput.value = app.currentUser.name;
  }

  const minNext = auc.currentBid + 1000;
  if (minBid) minBid.textContent = `₹ ${minNext.toLocaleString('en-IN')}`;
  if (amountInput) {
    amountInput.value = minNext;
    amountInput.min = minNext;
  }

  renderBidHistoryFeed(auc);

  if (modal) modal.classList.add('active');
};

function renderBidHistoryFeed(auc) {
  const feed = document.getElementById('bidHistoryFeed');
  if (!feed) return;

  const history = auc.bidHistory || [];
  if (history.length === 0) {
    feed.innerHTML = `<div style="font-size: 0.78rem; color: var(--text-muted);">No bids yet. Be the first!</div>`;
    return;
  }

  feed.innerHTML = history.map(item => `
    <div class="bid-feed-item">
      <span><strong>${item.bidder}</strong> • ${item.time}</span>
      <span style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-gold);">₹ ${item.amount.toLocaleString('en-IN')}</span>
    </div>
  `).join('');
}

// ==========================================
// 13. RESEARCH PAPER MODAL & PDF EXPORT
// ==========================================
window.openPaperModal = function(id) {
  const paper = (app.data.researchPapers || []).find(p => p.id === id);
  if (!paper) return;

  app.activePaperId = id;
  const modal = document.getElementById('paperModal');
  const cat = document.getElementById('paperModalCategory');
  const title = document.getElementById('paperModalTitle');
  const author = document.getElementById('paperModalAuthor');
  const date = document.getElementById('paperModalDate');
  const abstract = document.getElementById('paperModalAbstract');
  const content = document.getElementById('paperModalContent');

  if (cat) cat.textContent = paper.category;
  if (title) title.textContent = paper.title;
  if (author) author.textContent = `${paper.author} (${paper.affiliation || 'Fellow'})`;
  if (date) date.textContent = paper.date || '2026';
  if (abstract) abstract.textContent = paper.abstract;
  if (content) content.innerHTML = paper.content.replace(/\n/g, '<br>');

  if (modal) modal.classList.add('active');
};

window.downloadPaperPdf = function(id) {
  const paper = (app.data.researchPapers || []).find(p => p.id === id);
  if (!paper) return;

  const fileContent = `================================================================================
AUTONOMY WALKS ACADEMIC & POLICY REPOSITORY
Title: ${paper.title.toUpperCase()}
Category: ${paper.category} | Date: ${paper.date}
Author(s): ${paper.author} (${paper.affiliation || 'Autonomy Walks Research Bureau'})
================================================================================

EXECUTIVE ABSTRACT:
${paper.abstract}

--------------------------------------------------------------------------------
CORE FINDINGS & METHODOLOGY:
${paper.content}

--------------------------------------------------------------------------------
HOW TO CITE THIS PAPER:
${paper.author}. (${paper.date}). "${paper.title}". Autonomy Walks Policy Review.
================================================================================
`;

  const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${paper.title.replace(/[^a-zA-Z0-9]/g, '_')}_Autonomy_Walks.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast(`Downloaded Research Paper: "${paper.title}"`, 'success');
};

// ==========================================
// 14. SCHOLARSHIP APPLICATION MODAL
// ==========================================
window.openScholarshipModal = function(id) {
  const sch = (app.data.scholarships || []).find(s => s.id === id);
  if (!sch) return;

  app.activeScholarshipId = id;
  const modal = document.getElementById('scholarshipModal');
  const title = document.getElementById('scholarshipModalTitle');

  if (title) title.textContent = `Apply for: ${sch.title}`;

  if (app.currentUser) {
    const nameInput = document.getElementById('applicantName');
    const emailInput = document.getElementById('applicantEmail');
    if (nameInput) nameInput.value = app.currentUser.name;
    if (emailInput) emailInput.value = app.currentUser.email;
  }

  if (modal) modal.classList.add('active');
};

// ==========================================
// 15. ADMIN CMS STUDIO
// ==========================================
function initAdminTabs() {
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-tab-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.dataset.tab;
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  const resetBtn = document.getElementById('resetDemoDataBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all data back to the default demo state?')) {
        app.resetToDemoData();
        renderAllSections();
        showToast('Seed editorial catalog restored!', 'success');
      }
    });
  }
}

function renderAdminTable() {
  const tbody = document.getElementById('adminManageTableBody');
  if (!tbody) return;

  const rows = [];

  (app.data.articles || []).forEach(art => {
    rows.push(`
      <tr>
        <td><span class="category-badge">Article</span></td>
        <td><strong>${art.title}</strong></td>
        <td>${art.author} (${art.category})</td>
        <td>${art.likes} likes</td>
        <td><button class="btn-delete-row" onclick="deleteAdminItem('article', '${art.id}')">Delete</button></td>
      </tr>
    `);
  });

  (app.data.campaigns || []).forEach(camp => {
    rows.push(`
      <tr>
        <td><span class="category-badge politics">Campaign</span></td>
        <td><strong>${camp.title}</strong></td>
        <td>${camp.subtitle}</td>
        <td>${camp.likes} likes</td>
        <td><button class="btn-delete-row" onclick="deleteAdminItem('campaign', '${camp.id}')">Delete</button></td>
      </tr>
    `);
  });

  (app.data.auctions || []).forEach(auc => {
    rows.push(`
      <tr>
        <td><span class="category-badge art">Auction</span></td>
        <td><strong>${auc.title}</strong></td>
        <td>${auc.artist}</td>
        <td>₹ ${auc.currentBid.toLocaleString('en-IN')} (${auc.totalBids} bids)</td>
        <td><button class="btn-delete-row" onclick="deleteAdminItem('auction', '${auc.id}')">Delete</button></td>
      </tr>
    `);
  });

  (app.data.polls || []).forEach(poll => {
    rows.push(`
      <tr>
        <td><span class="category-badge">Poll</span></td>
        <td><strong>${poll.question}</strong></td>
        <td>${poll.options.length} options</td>
        <td>${poll.totalVotes} votes</td>
        <td><button class="btn-delete-row" onclick="deleteAdminItem('poll', '${poll.id}')">Delete</button></td>
      </tr>
    `);
  });

  (app.data.researchPapers || []).forEach(paper => {
    rows.push(`
      <tr>
        <td><span class="category-badge research">Paper</span></td>
        <td><strong>${paper.title}</strong></td>
        <td>${paper.author}</td>
        <td>PDF Archive</td>
        <td><button class="btn-delete-row" onclick="deleteAdminItem('paper', '${paper.id}')">Delete</button></td>
      </tr>
    `);
  });

  tbody.innerHTML = rows.join('');
}

window.deleteAdminItem = function(type, id) {
  if (!confirm('Are you sure you want to remove this item?')) return;

  if (type === 'article') {
    app.data.articles = (app.data.articles || []).filter(a => a.id !== id);
  } else if (type === 'campaign') {
    app.data.campaigns = (app.data.campaigns || []).filter(c => c.id !== id);
  } else if (type === 'auction') {
    app.data.auctions = (app.data.auctions || []).filter(a => a.id !== id);
  } else if (type === 'poll') {
    app.data.polls = (app.data.polls || []).filter(p => p.id !== id);
  } else if (type === 'paper') {
    app.data.researchPapers = (app.data.researchPapers || []).filter(p => p.id !== id);
  }

  app.saveData();
  renderAllSections();
  showToast(`Item removed from ${type} catalog`, 'info');
};

// ==========================================
// 16. SEARCH & FILTER
// ==========================================
function initSearch() {
  const searchInput = document.getElementById('searchKeywordInput');
  const resultsContainer = document.getElementById('searchResultsContainer');

  if (!searchInput || !resultsContainer) return;

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) {
      resultsContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 30px;">Type to search across the entire Autonomy Walks archive...</div>`;
      return;
    }

    const matches = [];

    (app.data.articles || []).forEach(art => {
      if (art.title.toLowerCase().includes(q) || (art.author && art.author.toLowerCase().includes(q)) || (art.excerpt && art.excerpt.toLowerCase().includes(q))) {
        matches.push({ type: 'Story', title: art.title, meta: `By ${art.author} • ${art.category}`, action: () => openArticleReader(art.id) });
      }
    });

    (app.data.campaigns || []).forEach(camp => {
      if (camp.title.toLowerCase().includes(q) || (camp.description && camp.description.toLowerCase().includes(q))) {
        matches.push({ type: 'Campaign', title: camp.title, meta: camp.subtitle, action: () => openCampaignDetail(camp.id) });
      }
    });

    (app.data.auctions || []).forEach(auc => {
      if (auc.title.toLowerCase().includes(q) || (auc.artist && auc.artist.toLowerCase().includes(q))) {
        matches.push({ type: 'Auction', title: auc.title, meta: `Current bid: ₹ ${auc.currentBid.toLocaleString('en-IN')}`, action: () => openBidModal(auc.id) });
      }
    });

    (app.data.scienceTech || []).forEach(sci => {
      if (sci.title.toLowerCase().includes(q) || (sci.author && sci.author.toLowerCase().includes(q)) || (sci.excerpt && sci.excerpt.toLowerCase().includes(q))) {
        matches.push({ type: 'Science & Tech', title: sci.title, meta: `By ${sci.author} • ${sci.category}`, action: () => openArticleReader(sci.id) });
      }
    });

    (app.data.researchPapers || []).forEach(paper => {
      if (paper.title.toLowerCase().includes(q) || (paper.author && paper.author.toLowerCase().includes(q))) {
        matches.push({ type: 'Research Paper', title: paper.title, meta: `By ${paper.author}`, action: () => openPaperModal(paper.id) });
      }
    });

    if (matches.length === 0) {
      resultsContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 30px;">No matching results found for "${e.target.value}".</div>`;
      return;
    }

    resultsContainer.innerHTML = matches.map((m, idx) => `
      <div class="search-result-card" onclick="handleSearchResultClick(${idx})">
        <div>
          <span class="category-badge" style="font-size: 0.65rem; margin-bottom: 2px;">${m.type}</span>
          <h4 style="font-family: var(--font-serif); font-size: 0.95rem; margin-top: 2px;">${m.title}</h4>
          <span style="font-size: 0.74rem; color: var(--text-muted);">${m.meta}</span>
        </div>
        <span style="font-size: 0.76rem; color: var(--text-secondary);">Open →</span>
      </div>
    `).join('');

    window._searchMatches = matches;
  });
}

window.handleSearchResultClick = function(idx) {
  const match = window._searchMatches && window._searchMatches[idx];
  if (match && match.action) {
    document.getElementById('searchModal')?.classList.remove('active');
    match.action();
  }
};

// ==========================================
// 17. EVENT HANDLERS & BINDINGS
// ==========================================
function initEventHandlers() {
  initSearch();

  // Close modals
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  });

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal-backdrop')?.classList.remove('active');
    });
  });

  // Kinfolk Two Lines Menu Overlay Trigger (=)
  const kinfolkToggle = document.getElementById('kinfolkMenuToggle');
  const closeKinfolkBtn = document.getElementById('closeKinfolkMenuBtn');

  if (kinfolkToggle) {
    kinfolkToggle.addEventListener('click', openKinfolkMenu);
  }
  if (closeKinfolkBtn) {
    closeKinfolkBtn.addEventListener('click', closeKinfolkMenu);
  }

  // Close Kinfolk menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeKinfolkMenu();
    }
  });

  // Secret Admin Trigger at bottom of website
  const openAdminBtn = document.getElementById('openAdminModalBtn');
  const adminModal = document.getElementById('adminModal');

  if (openAdminBtn) {
    openAdminBtn.addEventListener('click', () => {
      renderAdminTable();
      adminModal?.classList.add('active');
      showToast('Autonomy Walks Admin Studio Opened', 'info');
    });
  }

  // Global Modal Openers
  window.openSearchModal = function() {
    const modal = document.getElementById('searchModal');
    if (modal) {
      modal.classList.add('active');
      setTimeout(() => document.getElementById('searchKeywordInput')?.focus(), 100);
    }
  };

  window.openBookmarksDrawer = function() {
    const modal = document.getElementById('bookmarksModal');
    if (modal) {
      renderBookmarksList();
      modal.classList.add('active');
    }
  };

  window.openAllArticlesDrawer = function() {
    const section = document.getElementById('editorial-series');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Search & Bookmarks Modals
  document.getElementById('openSearchBtn')?.addEventListener('click', window.openSearchModal);
  document.getElementById('openBookmarksBtn')?.addEventListener('click', window.openBookmarksDrawer);

  // Campaign Filter Tabs
  const filterTabs = document.querySelectorAll('.filter-tab-btn');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderCampaigns(tab.dataset.filter);
    });
  });

  // Hero Controls
  document.getElementById('heroReadPrimaryBtn')?.addEventListener('click', () => {
    const currentHero = (app.data.heroStories || [])[app.activeHeroIndex];
    const targetArticleId = currentHero ? currentHero.articleId : 'art-1';
    openArticleReader(targetArticleId);
  });

  // Article Reader Action Bar buttons
  document.getElementById('readerLikeBtn')?.addEventListener('click', () => {
    if (!app.activeArticleId) return;

    if (!app.isAuthenticated()) {
      app.pendingLikeTarget = { id: app.activeArticleId, type: 'article' };
      openAuthModal('signin', 'Please sign in or create an account to like this story!');
      return;
    }

    const liked = app.toggleLike(app.activeArticleId, 'article');
    updateReaderModalLikeBtn();
    renderArticles();
    showToast(liked ? 'Article liked ❤️' : 'Like removed');
  });

  document.getElementById('readerBookmarkBtn')?.addEventListener('click', () => {
    if (app.activeArticleId) {
      const art = (app.data.articles || []).find(a => a.id === app.activeArticleId);
      if (art) {
        const bookmarked = app.toggleBookmark(art.id, art.title, 'Article');
        updateBookmarksBadge();
        showToast(bookmarked ? 'Saved to bookmarks 🔖' : 'Removed from bookmarks');
      }
    }
  });

  document.getElementById('readerShareBtn')?.addEventListener('click', () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard!', 'success');
    } else {
      showToast('Share link: ' + window.location.href, 'info');
    }
  });

  // Article Comment Form Submission
  document.getElementById('articleCommentForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('commentAuthorInput').value.trim();
    const email = document.getElementById('commentEmailInput').value.trim();
    const text = document.getElementById('commentTextInput').value.trim();

    if (!name || !text || !app.activeArticleId) return;

    app.addArticleComment(app.activeArticleId, name, email, text);
    const art = (app.data.articles || []).find(a => a.id === app.activeArticleId);
    if (art) renderReaderComments(art);
    renderArticles();

    document.getElementById('commentTextInput').value = '';
    showToast('Your comment was published to the public thread!', 'success');
  });

  // Bidding Form Submission
  document.getElementById('placeBidForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('bidderNameInput').value.trim();
    const amount = Number(document.getElementById('bidAmountInput').value);

    if (!name || !amount || !app.activeAuctionId) return;

    const res = app.placeAuctionBid(app.activeAuctionId, name, amount);
    if (res.success) {
      document.getElementById('bidModalCurrentBid').textContent = `₹ ${amount.toLocaleString('en-IN')}`;
      const minNext = amount + 1000;
      document.getElementById('bidModalMinBid').textContent = `₹ ${minNext.toLocaleString('en-IN')}`;
      document.getElementById('bidAmountInput').value = minNext;
      document.getElementById('bidAmountInput').min = minNext;

      renderBidHistoryFeed(res.auction);
      renderAuctions();
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  });

  // Preset Bid Buttons
  document.getElementById('presetPlus5k')?.addEventListener('click', () => addPresetBid(5000));
  document.getElementById('presetPlus10k')?.addEventListener('click', () => addPresetBid(10000));
  document.getElementById('presetPlus25k')?.addEventListener('click', () => addPresetBid(25000));

  function addPresetBid(delta) {
    if (!app.activeAuctionId) return;
    const auc = (app.data.auctions || []).find(a => a.id === app.activeAuctionId);
    if (!auc) return;
    const input = document.getElementById('bidAmountInput');
    if (input) input.value = (auc.currentBid + delta);
  }

  // Research Paper Citations & Download
  document.getElementById('paperCiteBtn')?.addEventListener('click', () => {
    if (app.activePaperId) {
      const paper = (app.data.researchPapers || []).find(p => p.id === app.activePaperId);
      if (paper) {
        const citation = `${paper.author}. (${paper.date}). "${paper.title}". Autonomy Walks Policy Review.`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(citation);
          showToast('Academic citation copied to clipboard!', 'success');
        } else {
          showToast(citation, 'info');
        }
      }
    }
  });

  document.getElementById('paperDownloadPdfBtn')?.addEventListener('click', () => {
    if (app.activePaperId) downloadPaperPdf(app.activePaperId);
  });

  // Scholarship Application Form
  document.getElementById('scholarshipApplicationForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('applicantName').value;
    document.getElementById('scholarshipModal')?.classList.remove('active');
    e.target.reset();
    showToast(`Thank you, ${name}! Your application has been received for committee review.`, 'success');
  });

  document.getElementById('cancelScholarshipBtn')?.addEventListener('click', () => {
    document.getElementById('scholarshipModal')?.classList.remove('active');
  });

  // Newsletter Subscription
  document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmailInput').value;
    e.target.reset();
    showToast(`Welcome to Autonomy Walks! We've sent a welcome issue to ${email}.`, 'success');
  });

  // ==========================================
  // ADMIN FORMS SUBMISSION
  // ==========================================

  // Tab 1: Upload Article
  document.getElementById('adminArticleForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newArt = {
      id: 'art-' + Date.now(),
      issue: 'Issue 59',
      title: document.getElementById('artTitle').value.trim().toUpperCase(),
      category: document.getElementById('artCategory').value,
      author: document.getElementById('artAuthor').value.trim(),
      photographer: 'Raphaëlle Orphelin',
      stylist: 'Editorial Atelier',
      readTime: document.getElementById('artReadTime').value.trim(),
      date: 'Issue Fifty-Nine',
      image: document.getElementById('artImageUrl').value.trim(),
      excerpt: document.getElementById('artExcerpt').value.trim(),
      content: document.getElementById('artContent').value.trim(),
      quote: '“An independent voice in an era of homogenization.”',
      likes: 0,
      comments: []
    };

    if (!app.data.articles) app.data.articles = [];
    app.data.articles.unshift(newArt);
    app.saveData();
    renderArticles();
    renderAdminTable();
    e.target.reset();
    document.getElementById('adminModal')?.classList.remove('active');
    showToast(`Article "${newArt.title}" published!`, 'success');
  });

  // Tab 2: Upload Campaign
  document.getElementById('adminCampaignForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newCamp = {
      id: 'camp-' + Date.now(),
      title: document.getElementById('campTitle').value.trim().toUpperCase(),
      category: document.getElementById('campCategory').value,
      subtitle: document.getElementById('campSubtitle').value.trim(),
      image: document.getElementById('campImageUrl').value.trim(),
      description: document.getElementById('campDescription').value.trim(),
      likes: 0
    };

    if (!app.data.campaigns) app.data.campaigns = [];
    app.data.campaigns.unshift(newCamp);
    app.saveData();
    renderCampaigns('all');
    renderAdminTable();
    e.target.reset();
    document.getElementById('adminModal')?.classList.remove('active');
    showToast(`Campaign pick "${newCamp.title}" added!`, 'success');
  });

  // Tab 3: Create Live Auction
  document.getElementById('adminAuctionForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const durationHours = Number(document.getElementById('aucDurationHours').value) || 4;
    const newAuc = {
      id: 'auc-' + Date.now(),
      title: document.getElementById('aucTitle').value.trim(),
      artist: document.getElementById('aucArtist').value.trim(),
      medium: document.getElementById('aucMedium').value.trim(),
      image: document.getElementById('aucImageUrl').value.trim(),
      currentBid: Number(document.getElementById('aucStartBid').value),
      totalBids: 1,
      remainingSeconds: durationHours * 3600,
      bidHistory: [
        { bidder: 'Starting Lot Entry', amount: Number(document.getElementById('aucStartBid').value), time: 'Just now' }
      ]
    };

    if (!app.data.auctions) app.data.auctions = [];
    app.data.auctions.unshift(newAuc);
    app.saveData();
    renderAuctions();
    renderAdminTable();
    e.target.reset();
    document.getElementById('adminModal')?.classList.remove('active');
    showToast(`Live Auction for "${newAuc.title}" launched!`, 'success');
  });

  // Tab 4: Add Opinion Poll
  document.getElementById('adminPollForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const question = document.getElementById('pollQuestionInput').value.trim();
    const optInputs = document.querySelectorAll('.poll-opt-input');
    const options = [];

    optInputs.forEach(input => {
      const val = input.value.trim();
      if (val) options.push({ text: val, votes: 0 });
    });

    if (options.length < 2) {
      showToast('Please provide at least 2 voting options.', 'error');
      return;
    }

    const newPoll = {
      id: 'poll-' + Date.now(),
      question: question,
      category: 'CITIZEN POLL',
      totalVotes: 0,
      options: options
    };

    if (!app.data.polls) app.data.polls = [];
    app.data.polls.unshift(newPoll);
    app.saveData();
    renderPolls();
    renderAdminTable();
    e.target.reset();
    document.getElementById('adminModal')?.classList.remove('active');
    showToast('New citizen poll published!', 'success');
  });

  // Tab 5: Upload Research Paper
  document.getElementById('adminPaperForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPaper = {
      id: 'paper-' + Date.now(),
      title: document.getElementById('paperTitle').value.trim(),
      category: document.getElementById('paperCategory').value,
      author: document.getElementById('paperAuthor').value.trim(),
      affiliation: document.getElementById('paperAffiliation').value.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      abstract: document.getElementById('paperAbstractInput').value.trim(),
      content: document.getElementById('paperBodyContent').value.trim()
    };

    if (!app.data.researchPapers) app.data.researchPapers = [];
    app.data.researchPapers.unshift(newPaper);
    app.saveData();
    renderResearchPapers();
    renderAdminTable();
    e.target.reset();
    document.getElementById('adminModal')?.classList.remove('active');
    showToast(`Research paper "${newPaper.title}" archived!`, 'success');
  });
}

// Bookmarks Drawer
function openBookmarksDrawer() {
  const modal = document.getElementById('bookmarksModal');
  const container = document.getElementById('bookmarksListContainer');
  if (!container) return;

  if (app.userBookmarks.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 40px 20px;">No saved bookmarks yet. Click "Bookmark" inside any story to save it for later reading.</div>`;
  } else {
    container.innerHTML = app.userBookmarks.map(b => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border: 1px solid var(--border-hairline); background: var(--bg-paper-light);">
        <div>
          <span class="category-badge" style="font-size: 0.65rem; margin-bottom: 4px;">${b.type}</span>
          <h4 style="font-family: var(--font-serif); font-size: 0.95rem;">${b.title}</h4>
          <span style="font-size: 0.72rem; color: var(--text-muted);">Saved on ${b.date}</span>
        </div>
        <button class="btn btn-outline btn-sm" onclick="openBookmarkedItem('${b.id}', '${b.type}')">Read</button>
      </div>
    `).join('');
  }

  modal?.classList.add('active');
}

window.openBookmarkedItem = function(id, type) {
  document.getElementById('bookmarksModal')?.classList.remove('active');
  if (type === 'Article') {
    openArticleReader(id);
  }
};

window.openAllArticlesDrawer = function() {
  openArticleReader('art-1');
};
