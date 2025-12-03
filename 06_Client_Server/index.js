const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000();

//static folder is client folder
app.use(express.static(path.join(__dirname, "client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/home.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "client/home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "client/home.html"));
});

app.listen(PORT, () => {
  console.log(`server running at https://localhost:$(PORT)`);
});
