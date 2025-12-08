// Get HTML DOM element references
const form = document.getElementById("songForm");
const list = document.getElementById("songList");
const submitBtn = document.getElementById("submitBtn");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const cardContainer = document.getElementById("cardContainer");
const tableEl = document.getElementById("songTable");
const toggleViewBtn = document.getElementById("toggleViewBtn");

// If playlist doesn't exist in local storage, get empty array
// else get JSON text and convert it to JS object
let songs = JSON.parse(localStorage.getItem("playlist")) || [];

// State for search + sort
let currentSearch = "";
let currentSort = sortSelect ? sortSelect.value : "newest";

//sort logic by radio
let sortMode = "date";

document.querySelectorAll("input[name='sortRadio']").forEach((radio) => {
  radio.addEventListener("change", (e) => {
    sortMode = e.target.value;
    renderSongs();
  });
});

let isTableView = true; //true = table, false = card

// helper: extract youtube video ID
function getYoutubeId(url) {
  if (!url) return "";

  // youtu.be/VIDEOID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return shortMatch[1];

  // youtube.com/watch?v=VIDEOID
  const longMatch = url.match(/[?&]v=([^&]+)/);
  if (longMatch) return longMatch[1];

  return "";
}

// First render on page load (show existing songs from localStorage)
renderSongs();

// User clicks "Add" / "Update" button (form submit)
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Read form data
  const title = document.getElementById("title").value;
  const url = document.getElementById("url").value;
  const ratingValue = document.getElementById("rating").value;
  const songId = document.getElementById("songId").value; // hidden id

  const rating = parseInt(ratingValue, 10);
  const youtubeId = getYoutubeId(url);

  // Basic validation
  if (!title.trim() || !url.trim()) {
    alert("Please fill in both title and URL");
    return;
  }

  if (isNaN(rating) || rating < 1 || rating > 10) {
    alert("Please enter a rating between 1 and 10");
    return;
  }

  //allow non-YouTube links, just no thumbnail
  if (!youtubeId) {
    console.warn("Could not extract YouTube ID from URL:", url);
  }

  if (songId) {
    // UPDATE MODE
    updateSong(Number(songId), title, url, rating, youtubeId);
  } else {
    // ADD MODE
    const song = {
      id: Date.now(), // Unique ID
      title: title,
      url: url,
      rating: rating,
      youtubeId: youtubeId,
      dateAdded: Date.now(),
    };

    songs.push(song);
  }

  // Save to localStorage and re-render
  saveAndRender();

  // Reset form & button back to "Add" mode
  form.reset();
  document.getElementById("songId").value = "";
  submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
  submitBtn.classList.remove("btn-warning");
  submitBtn.classList.add("btn-success");
});

// Save to local storage and render UI table
function saveAndRender() {
  localStorage.setItem("playlist", JSON.stringify(songs));
  renderSongs();
}

function renderSongs() {
  list.innerHTML = ""; // clear table body
  if (cardContainer) cardContainer.innerHTML = ""; // clear cards

  // 1) filter by search
  let filtered = songs.filter((song) => {
    if (!currentSearch) return true;
    const title = (song.title || "").toLowerCase();
    return title.includes(currentSearch);
  });

  // 2) sort by radio mode
  if (sortMode === "name") {
    filtered.sort((a, b) =>
      (a.title || "").toLowerCase().localeCompare((b.title || "").toLowerCase())
    );
  } else if (sortMode === "rating") {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    // default: date (newest first)
    filtered.sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0));
  }

  // 3) build TABLE ROWS + CARDS
  filtered.forEach((song) => {
    const youtubeId = song.youtubeId || getYoutubeId(song.url);
    const thumbUrl = youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      : "";

    // ----- TABLE ROW -----
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${song.title}</td>
      <td>${song.rating ?? "-"}</td>
      <td>
        ${
          thumbUrl
            ? `<img src="${thumbUrl}" alt="${song.title}" class="img-thumbnail" style="max-width: 120px;">`
            : ""
        }
      </td>
      <td>
        <a href="${song.url}" target="_blank" class="text-info">Watch</a>
      </td>
      <td class="text-end">
        <button class="btn btn-sm btn-primary me-2" onclick="openPlayer('${youtubeId}')">
          <i class="fas fa-play"></i>
        </button>
        <button class="btn btn-sm btn-info me-2" onclick="showDetails(${
          song.id
        })">
          <i class="fas fa-circle-info"></i>
        </button>
        <button class="btn btn-sm btn-warning me-2" onclick="editSong(${
          song.id
        })">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    list.appendChild(row);

    // ----- CARD VIEW -----
    if (cardContainer) {
      const col = document.createElement("div");
      col.className = "col-md-4 col-sm-6";

      col.innerHTML = `
        <div class="card h-100">
          ${
            thumbUrl
              ? `<img src="${thumbUrl}" class="card-img-top" alt="${song.title}">`
              : ""
          }
          <div class="card-body">
            <h5 class="card-title">${song.title}</h5>
            <p class="card-text mb-1">Rating: ${song.rating ?? "-"}</p>
            <p class="card-text">
              <small class="text-muted">
                Added: ${
                  song.dateAdded
                    ? new Date(song.dateAdded).toLocaleString()
                    : "Unknown"
                }
              </small>
            </p>
            <div class="d-flex flex-wrap gap-2">
              <button class="btn btn-sm btn-primary" onclick="openPlayer('${youtubeId}')">
                <i class="fas fa-play"></i> Play
              </button>
              <a href="${
                song.url
              }" target="_blank" class="btn btn-sm btn-outline-info">
                Watch on YouTube
              </a>
              <button class="btn btn-sm btn-info" onclick="showDetails(${
                song.id
              })">
                Details
              </button>
              <button class="btn btn-sm btn-warning" onclick="editSong(${
                song.id
              })">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-danger" onclick="deleteSong(${
                song.id
              })">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;
      cardContainer.appendChild(col);
    }
  });

  // 4) show/hide correct view
  if (tableEl && cardContainer) {
    if (isTableView) {
      tableEl.classList.remove("d-none");
      cardContainer.classList.add("d-none");
    } else {
      tableEl.classList.add("d-none");
      cardContainer.classList.remove("d-none");
    }
  }
}

function openPlayer(videoId) {
  if (!videoId) {
    alert("No YouTube video ID found.");
    return;
  }

  const url = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  const width = 560;
  const height = 315;
  const left = (screen.width - width) / 2;
  const top = (screen.height - height) / 2;

  window.open(
    url,
    "ytplayer",
    `width=${width},height=${height},top=${top},left=${left}`
  );
}

function deleteSong(id) {
  if (confirm("Are you sure?")) {
    songs = songs.filter((song) => song.id !== id);
    saveAndRender();
  }
}

function editSong(id) {
  const songToEdit = songs.find((song) => song.id === id);
  if (!songToEdit) return;

  document.getElementById("title").value = songToEdit.title;
  document.getElementById("url").value = songToEdit.url;
  document.getElementById("rating").value = songToEdit.rating ?? "";
  document.getElementById("songId").value = songToEdit.id;

  submitBtn.innerHTML = '<i class="fas fa-save"></i> Update';
  submitBtn.classList.remove("btn-success");
  submitBtn.classList.add("btn-warning");
}

function updateSong(id, title, url, rating) {
  const index = songs.findIndex((song) => song.id === id);
  if (index === -1) return;

  songs[index].title = title;
  songs[index].url = url;
  songs[index].rating = rating;
  songs[index].youtubeId = youtubeId || getYoutubeId(url);
}

// ===== Search & sort listeners =====
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value.toLowerCase();
    renderSongs();
  });
}

if (sortSelect) {
  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderSongs();
  });
}

function showDetails(id) {
  const song = songs.find((s) => s.id === id);
  if (!song) return;

  const youtubeId = song.youtubeId || getYoutubeId(song.url);
  const thumbUrl = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : "";

  // Fill modal content
  document.getElementById("detailsTitle").textContent = song.title;

  document.getElementById("detailsBody").innerHTML = `
    <div class="text-center mb-3">
      ${
        thumbUrl
          ? `<img src="${thumbUrl}" class="img-fluid rounded mb-2" style="max-width: 250px;">`
          : ""
      }
    </div>

    <p><strong>Rating:</strong> ${song.rating ?? "-"}</p>
    <p><strong>YouTube URL:</strong> 
      <a href="${song.url}" target="_blank" class="text-info">Open Video</a>
    </p>
    <p><strong>Video ID:</strong> ${youtubeId || "Unknown"}</p>
    <p><strong>Date Added:</strong> ${new Date(
      song.dateAdded
    ).toLocaleString()}</p>
  `;

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById("detailsModal"));
  modal.show();
}

if (toggleViewBtn) {
  toggleViewBtn.addEventListener("click", () => {
    isTableView = !isTableView;
    toggleViewBtn.textContent = isTableView ? "Cards View" : "Table View";
    renderSongs();
  });
}
