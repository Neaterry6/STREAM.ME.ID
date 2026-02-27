// ======== Variables ========
const loadingScreen = document.getElementById('loadingScreen');
const resultsGrid = document.getElementById('resultsGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const historyPanel = document.getElementById('searchHistory');

const playerModal = document.getElementById('playerModal');
const mediaTitle = document.getElementById('mediaTitle');
const mediaArtist = document.getElementById('mediaArtist');
const coverImage = document.getElementById('coverImage');
const audioPlayer = document.getElementById('audioPlayer');
const videoPlayer = document.getElementById('videoPlayer');
const downloadBtn = document.getElementById('downloadBtn');

let searchHistoryArr = JSON.parse(localStorage.getItem('searchHistory')) || [];

// ======== Load trending on startup ========
window.addEventListener('load', () => {
  setTimeout(() => loadingScreen.style.display = 'none', 1000);
  loadTrending();
  renderHistory();
});

// ======== Load Trending Music & Video ========
async function loadTrending() {
  resultsGrid.innerHTML = "<p style='color:#fff'>Loading trending...</p>";

  try {
    const [yt, spotify] = await Promise.all([
      fetch(`/api/yts/searchAll?query=trending`).then(r => r.json()),
      fetch(`/api/spotify/search?q=trending`).then(r => r.json())
    ]);

    displayResults([...yt.results || [], ...spotify.results || []]);
  } catch(err) {
    resultsGrid.innerHTML = "<p style='color:red'>Error loading trending!</p>";
    console.error(err);
  }
}

// ======== Search ========
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (!query) return;

  saveHistory(query);
  performSearch(query);
});

async function performSearch(query) {
  resultsGrid.innerHTML = "<p style='color:#fff'>Searching...</p>";
  try {
    const [yt, spotify, mb] = await Promise.all([
      fetch(`/api/yts/searchAll?query=${query}`).then(r => r.json()),
      fetch(`/api/spotify/search?q=${query}`).then(r => r.json()),
      fetch(`/api/musicbrainz/search?query=${query}`).then(r => r.json())
    ]);

    const combinedResults = [...yt.results || [], ...spotify.results || [], ...mb.results || []];
    displayResults(combinedResults);
  } catch(err) {
    resultsGrid.innerHTML = "<p style='color:red'>Error fetching results!</p>";
    console.error(err);
  }
}

// ======== Display Results ========
function displayResults(results) {
  resultsGrid.innerHTML = '';
  results.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    const title = item.title || item.name || item.track;
    const artist = item.artist || item.channel || item.artist_name || "Unknown";
    const img = item.cover || item.thumbnail || 'https://via.placeholder.com/250';

    card.innerHTML = `
      <img src="${img}" alt="${title}">
      <h3>${title}</h3>
      <p>${artist}</p>
      <button onclick="openModal(${JSON.stringify(item)})">Play</button>
    `;

    resultsGrid.appendChild(card);
  });
}

// ======== Player Modal ========
function openModal(item) {
  playerModal.style.display = 'flex';
  mediaTitle.textContent = item.title || item.name || item.track;
  mediaArtist.textContent = item.artist || item.channel || item.artist_name || "Unknown";
  coverImage.src = item.cover || item.thumbnail || 'https://via.placeholder.com/250';
  
  // Hide both
  audioPlayer.style.display = 'none';
  videoPlayer.style.display = 'none';

  if(item.type === 'video' || item.video_url) {
    videoPlayer.style.display = 'block';
    videoPlayer.src = item.video_url || item.url;
  } else {
    audioPlayer.style.display = 'block';
    audioPlayer.src = item.audio_url || item.url;
  }

  downloadBtn.href = item.download_url || item.url;
}

// ======== Close Modal ========
function closeModal(id) {
  const modal = document.getElementById(id);
  modal.style.display = 'none';
  audioPlayer.pause();
  videoPlayer.src = '';
}

// ======== Search History ========
function saveHistory(query) {
  if(!searchHistoryArr.includes(query)) {
    searchHistoryArr.unshift(query);
    if(searchHistoryArr.length > 10) searchHistoryArr.pop();
    localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArr));
    renderHistory();
  }
}

function renderHistory() {
  historyPanel.innerHTML = '';
  searchHistoryArr.forEach(q => {
    const div = document.createElement('div');
    div.textContent = q;
    div.onclick = () => {
      searchInput.value = q;
      performSearch(q);
    };
    historyPanel.appendChild(div);
  });
}

// ======== Theme Toggle ========
document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light');
});