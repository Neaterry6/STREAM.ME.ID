import { getHistory, addHistory } from './history.js';

const loadingScreen = document.getElementById("loading-screen");
const app = document.getElementById("app");
const searchInput = document.getElementById("searchInput");
const songsContainer = document.getElementById("songsContainer");
const albumsContainer = document.getElementById("albumsContainer");
const historyList = document.getElementById("historyList");

const playerModal = document.getElementById("playerModal");
const modalTitle = document.getElementById("modalTitle");
const audioPlayer = document.getElementById("audioPlayer");
const downloadBtn = document.getElementById("downloadBtn");
const closeModal = document.getElementById("closeModal");

const API_BASE = "/api"; // backend base

// Loading screen timeout
window.addEventListener("load", () => {
  setTimeout(() => {
    loadingScreen.classList.add("hidden");
    app.classList.remove("hidden");
    loadTrending();
    loadHistory();
  }, 1500);
});

// Search songs
searchInput.addEventListener("keypress", async (e) => {
  if(e.key === "Enter") {
    const query = searchInput.value;
    if(!query) return;
    loadSongs(query);
    addHistory({ type:"search", query });
  }
});

// Load trending songs
async function loadTrending() {
  loadSongs("trending");
  loadAlbums("top albums");
}

async function loadSongs(query) {
  songsContainer.innerHTML = "Loading...";
  const res = await fetch(`${API_BASE}/youtube/play?query=${encodeURIComponent(query)}`);
  const data = await res.json();
  songsContainer.innerHTML = "";
  data.videos?.forEach(song => {
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerHTML = `
      <img src="${song.thumbnail}" />
      <h4>${song.title}</h4>
      <p>${song.channel}</p>
    `;
    div.addEventListener("click", () => openPlayer(song));
    songsContainer.appendChild(div);
  });
}

async function loadAlbums(query) {
  albumsContainer.innerHTML = "Loading...";
  const res = await fetch(`${API_BASE}/musicbrainz/albums?query=${encodeURIComponent(query)}`);
  const data = await res.json();
  albumsContainer.innerHTML = "";
  data.albums?.forEach(album => {
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerHTML = `
      <img src="https://via.placeholder.com/150" />
      <h4>${album.title}</h4>
      <p>${album.artist}</p>
    `;
    albumsContainer.appendChild(div);
  });
}

// Open player modal
function openPlayer(song) {
  modalTitle.textContent = song.title;
  audioPlayer.src = song.url || song.streamUrl;
  downloadBtn.href = song.downloadUrl || song.url;
  playerModal.classList.remove("hidden");
}

// Close modal
closeModal.addEventListener("click", () => playerModal.classList.add("hidden"));

// History
async function loadHistory() {
  const history = await getHistory();
  historyList.innerHTML = "";
  history.forEach(h => {
    const li = document.createElement("li");
    li.textContent = `[${new Date(h.timestamp).toLocaleTimeString()}] ${h.type}: ${h.query}`;
    historyList.appendChild(li);
  });
}
