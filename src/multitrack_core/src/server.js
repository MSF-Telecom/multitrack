var express = require("express");
var gui_app = express();
var plugin_app = express();
var gui_port = 8080;
var plugin_port = 8081;

gui_app.get("/", function (req, res) {
  res.send("Hello World!");
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
