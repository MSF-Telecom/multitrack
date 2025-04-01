var express = require("express");
var gui_app = express();
var plugin_app = express();
const WebSocket = require('ws');

const GUI_PORT = process.env.GUI_PORT || 8000;
const GUI_WSS_PORT = process.env.GUI_WSS_PORT || 8001;
const PLUGIN_PORT = process.env.PLUGIN_PORT || 8081;

var gui_port = GUI_PORT;
var plugin_port = PLUGIN_PORT;

gui_app.use(express.static("app"));
gui_app.use(express.static("app/css"));
gui_app.use(express.static("app/js"));
gui_app.use(express.static("app/img"));
gui_app.use(express.static("app/fonts"));
gui_app.use(express.static("app/index.html"));
gui_app.use(express.static("app/favicon.ico"));
gui_app.use(express.static("maps"));
gui_app.use(express.json());

plugin_app.use(express.json());

const gui_wss = new WebSocket.Server({ port: GUI_WSS_PORT });
const wss_clients = new Set();

gui_wss.on('connection', function connection(ws) {
  wss_clients.add(ws);
  console.log('Client connected : ' + ws._socket.remoteAddress);
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send(`${message}`);
  });

  ws.on('close', function() {
    wss_clients.delete(ws);
    console.log('Client disconnected');
  });
});

gui_app.get("/", function (req, res) {
  // Serve the GUI from app folder
  // Also serve .css and .js files
  
  res.sendFile("index.html");
});

gui_app.get("/ping", function (req, res) {
  // Handle ping from plugin
  console.log("Received ping from plugin");
  wss_clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send("Ping from plugin");
    }
  });
  res.send("Pong");
});

plugin_app.get("/", function (req, res) {
  res.send("Hello World from plugin sink!");
});

plugin_app.post("/subscribe", function (req, res) {
  // Handle subscription to plugin
  // Open db.json file and add subscription
  console.log(req.body);
  db = require("./db.json");
  db[req.body.main_ID] = {
    type : req.body.type,
    main_ID : req.body.main_ID,
    actions : req.body.actions,
    text : req.body.text,
    position : req.body.position,
    status : req.body.status,
    entities : {}
  };
  console.log("db : ", db);
  console.log("Received subscription request Got source : " + req.body.main_ID);
  res.send("Subscription successful ! Got source : " + req.body.main_ID);
});

plugin_app.post("/unsubscribe", function (req, res) {
  // Handle unsubscription from plugin
  console.log("Received unsubscription request");
  res.send("Unsubscription successful");
});

plugin_app.post("/data", function (req, res) {
  // Handle data from plugin
  console.log("Received data from plugin");
  wss_clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(req.body));
    }
  });
  res.send("Data received");
});

gui_app.listen(gui_port, function () {
  console.log("Listening on gui port " + gui_port);
});

plugin_app.listen(plugin_port, function () {
  console.log("Listening on plugin port " + plugin_port);
});
