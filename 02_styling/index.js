// script.js
const tracks = [
  {
    videoId: "fJ9rUzIMcZQ",
    year: 2011,
    artist: "Queen",
    title: "Bohemian Rhapsody",
    albumArt:
      "https://i.scdn.co/image/ab67616d0000b273a4e0b7f0f7e4b8d6d4d5e7b3",
  },
  {
    videoId: "YQHsXMglC9A",
    year: 2015,
    artist: "Adele",
    title: "Hello",
    albumArt:
      "https://i.scdn.co/image/ab67616d0000b273e91f1b9a5b5f2d2c2b6a94a5",
  },
  {
    videoId: "kXYiU_JCYtU",
    year: 2007,
    artist: "Linkin Park",
    title: "Numb",
    albumArt:
      "https://i.scdn.co/image/ab67616d0000b2732c1d9c4a942c40a6a9a9c9ee",
  },
  {
    videoId: "hT_nvWreIhg",
    year: 2013,
    artist: "OneRepublic",
    title: "Counting Stars",
    albumArt:
      "https://i.scdn.co/image/ab67616d0000b2730c89b7e3f9e1a50452a6d8c9",
  },
  {
    videoId: "3JZ4pnNtyxQ",
    year: 2009,
    artist: "Eminem",
    title: "Without Me",
    albumArt:
      "https://i.scdn.co/image/ab67616d0000b273b4f5b7cc1a2b7d4a71c8e4e8",
  },
];
const yt = (id) => `https://www.youtube.com/embed/${id}?rel=0`;
function renderRows(list) {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  list.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><div class=\"video-box\"><iframe loading=\"lazy\" allowfullscreen title=\"YouTube video\" src=\"${yt(
      row.videoId
    )}\" allow=\"accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\"></iframe></div></td><td><span class=\"year-val\">${
      row.year
    }</span></td><td><span class=\"artist\">${
      row.artist
    }</span></td><td><span class=\"title\">${
      row.title
    }</span></td><td><span class=\"album\"><img loading=\"lazy\" alt=\"${
      row.title
    } album art\" src=\"${row.albumArt}\"></span></td>`;
    tbody.appendChild(tr);
  });
}
const q = document.getElementById("q");
q.addEventListener("input", () => {
  const val = q.value.trim().toLowerCase();
  if (!val) {
    renderRows(tracks);
    return;
  }
  const filtered = tracks.filter((t) =>
    `${t.artist} ${t.title}`.toLowerCase().includes(val)
  );
  renderRows(filtered);
});
renderRows(tracks);
