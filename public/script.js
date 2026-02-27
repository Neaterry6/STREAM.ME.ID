let currentSource = 'youtube';

// On load: hide loading screen, set background/logo, restore theme, load trending + history
window.onload = () => {
  setTimeout(() => document.getElementById('loadingScreen').style.display='none', 1500);
  setBackgroundAndLogo();
  restoreTheme();
  loadTrending();
  loadHistory();
};

document.getElementById('searchBtn').addEventListener('click', search);
document.getElementById('themeToggle').addEventListener('click', toggleTheme);

function setSource(source) {
  currentSource = source;
}

// ------------------ SEARCH ------------------
async function search() {
  const q = document.getElementById('searchInput').value.trim();
  if (!q) return;
  let url = '';
  if (currentSource === 'youtube') {
    url = `/api/yts/searchAll?q=${encodeURIComponent(q)}`;
  } else if (currentSource === 'spotify') {
    url = `/api/spotify/search?q=${encodeURIComponent(q)}`;
  } else {
    url = `/api/musicbrainz/search?q=${encodeURIComponent(q)}`;
  }
  try {
    const res = await fetch(url);
    const data = await res.json();
    renderResults(data, 'resultsGrid');
    loadHistory();
  } catch (err) {
    document.getElementById('resultsGrid').innerHTML = `<p>Error fetching results.</p>`;
  }
}

// ------------------ RENDER ------------------
function renderResults(data, targetId) {
  const grid = document.getElementById(targetId);
  grid.innerHTML = '';
  const items = data.items || data.results || data.tracks || [];
  if (!items.length) {
    grid.innerHTML = '<p>No results found.</p>';
    return;
  }
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${item.thumbnail || 'https://via.placeholder.com/250'}" alt="cover">
      <h3>${item.title || item.name || 'Untitled'}</h3>
      <p>${item.artist || item.channel || ''}</p>
      <button onclick='openPlayer(${JSON.stringify(item)})'>Play</button>
    `;
    grid.appendChild(card);
  });
}

// ------------------ PLAYER ------------------
function openPlayer(item) {
  document.getElementById('playerModal').style.display='flex';
  document.getElementById('mediaTitle').innerText = item.title || item.name || 'Untitled';
  document.getElementById('mediaArtist').innerText = item.artist || item.channel || '';
  document.getElementById('coverImage').src = item.thumbnail || 'https://via.placeholder.com/250';

  const audio = document.getElementById('audioPlayer');
  const video = document.getElementById('videoPlayer');
  audio.style.display='none';
  video.style.display='none';

  if (item.url && (item.url.endsWith('.mp3') || item.url.includes('audio'))) {
    audio.src = item.url;
    audio.style.display='block';
  } else if (item.videoId || item.videoUrl) {
    // embed YouTube video if videoId exists
    if (item.videoId) {
      video.src = `https://www.youtube.com/embed/${item.videoId}`;
    } else {
      video.src = item.videoUrl;
    }
    video.style.display='block';
  }

  const downloadBtn = document.getElementById('downloadBtn');
  if (item.downloadUrl) {
    downloadBtn.href = item.downloadUrl;
    downloadBtn.style.display = 'inline-block';
  } else {
    downloadBtn.href = '#';
    downloadBtn.style.display = 'none';
  }
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
  document.getElementById('audioPlayer').pause();
  document.getElementById('videoPlayer').src = '';
}

// ------------------ THEME ------------------
function toggleTheme() {
  const body = document.body;
  body.classList.toggle('light');
  localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
  applyTheme();
}

function restoreTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.body.classList.add('light');
  }
  applyTheme();
}

function applyTheme() {
  if (document.body.classList.contains('light')) {
    document.body.style.backgroundColor = '#fff';
    document.body.style.color = '#000';
  } else {
    document.body.style.backgroundColor = '#111';
    document.body.style.color = '#fff';
  }
}

// ------------------ HISTORY ------------------
async function loadHistory() {
  try {
    const res = await fetch('/api/history');
    const history = await res.json();
    const list = document.getElementById('historyList');
    list.innerHTML = '';
    history.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.endpoint} → ${entry.query} (${new Date(entry.timestamp).toLocaleString()})`;
      list.appendChild(li);
    });
  } catch(e){ console.error(e); }
}

// ------------------ TRENDING ------------------
async function loadTrending() {
  try {
    // Example: load trending albums from MusicBrainz
    const res = await fetch('/api/musicbrainz/albums?q=trending');
    const data = await res.json();
    renderResults(data, 'trending');
  } catch(e){ console.error(e); }
}

// ------------------ BACKGROUND/LOGO ------------------
async function setBackgroundAndLogo(){
  try {
    const res = await fetch('https://api.waifu.pics/sfw/waifu');
    const data = await res.json();
    document.body.style.backgroundImage = `url(${data.url})`;
    document.getElementById('logoImg').src = data.url;
  } catch(e){ console.error(e); }
}