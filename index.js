//page to navigate when menue item is clicked

function loadPage(page) {
  document.getElementById("contentFrame").src = page;

  //get reference for the HTML element by its ID
  //contentFrame is iframe element type
  let iframeElement = document.getElementById("contentFrame");

  //gives the iframe the HTML adddress
  iframeElement.src = page;

  // Close sidebar on mobile
  document.getElementById("sidebar").classList.remove("show");
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("show");
}
