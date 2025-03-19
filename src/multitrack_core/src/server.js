var express = require("express");
var gui_app = express();
var plugin_app = express();
var gui_port = 8080;
var plugin_port = 8081;


gui_app.use(express.static("app"));
gui_app.use(express.static("app/css"));
gui_app.use(express.static("app/js"));
gui_app.use(express.static("app/img"));
gui_app.use(express.static("app/fonts"));
gui_app.use(express.static("app/index.html"));
gui_app.use(express.static("app/favicon.ico"));

gui_app.get("/", function (req, res) {
  // Serve the GUI from app folder
  // Also serve .css and .js files
  
  res.sendFile("index.html");
});

plugin_app.get("/", function (req, res) {
  res.send("Hello World from plugin sink!");
});

gui_app.listen(gui_port, function () {
  console.log("Listening on gui port " + gui_port);
});

plugin_app.listen(plugin_port, function () {
  console.log("Listening on plugin port " + plugin_port);
});
