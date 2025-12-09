let songs = sessionStorage.getItem("songs");
if (!songs) {
  songs = [
    { id: 1, title: "Imagine", artist: "John Lennon", year: 1971 },
    { id: 2, title: "Bohemian Rhapsody", artist: "Queen", year: 1975 },
    { id: 3, title: "Nothing Else Matters", artist: "Metallica", year: 1992 },
  ];
  sessionStorage.setItem("songs", JSON.stringify(songs));
} else {
  songs = JSON.parse(songs);
}

sessionStorage.setItem("songs", JSON.stringify(songs));
//session storage is cleared when the page session ends (e.g. when a user logs in w/ email)
//local storage persists even after the browser is closed

const list = document.getElementById("list");
list.innerHTML = "";

//create list items dynamically
//innerHTML helps us to create HTML elements dynamically
songs.forEach((song) => {
  const viewUrl = `details.html?id=${song.id}&mode=view`;

  list.innerHTML += `
    <a href="${viewUrl}"
       class="list-group-item list-group-item-action
              d-flex justify-content-between">

      <span>
        <b>${song.title}</b> - ${song.artist}
      </span>

      <span class="badge bg-primary rounded-pill">
        ${song.year}
      </span>

    </a>
  `;
});
