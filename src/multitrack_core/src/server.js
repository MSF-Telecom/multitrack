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
    // check if message has "message_type" key
    if (message.includes("message_type")) {
      message = JSON.parse(message);
      console.log("Message type : " + message.message_type);
      if (message.message_type == "device_text") {
        // send HTTP post to main_ID:plugin_port
        db = require("./db.json");
        if (!db[message.main_ID]) {
          console.log("No main_ID found in db.json");
          return;
        }
        console.log("Sending text message to plugin : " + message.text);
        if (db[message.main_ID].plugin_port == 0) {
          console.log("No plugin port found for main_ID : " + message.main_ID);
          return;
        }
        const options = {
          hostname: message.main_ID,
          port: db[message.main_ID].listen_port,
          path: '/text',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const req = require('http').request(options, (res) => {
          console.log(`STATUS: ${res.statusCode}`);
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
          });
        });
        req.on('error', (e) => {
          console.error(`problem with request: ${e.message}`);
        });
        req.write(JSON.stringify(message));
        req.end();
        console.log("Message sent to plugin : " + message.main_ID);
      }
      
      if (message.message_type == "device_action") {
        // send HTTP post to main_ID:plugin_port
        db = require("./db.json");
        if (!db[message.main_ID]) {
          console.log("No main_ID found in db.json");
          return;
        }
        console.log("Sending action message to plugin : " + message.action);
        if (db[message.main_ID].plugin_port == 0) {
          console.log("No plugin port found for main_ID : " + message.main_ID);
          return;
        }
        const options = {
          hostname: message.main_ID,
          port: db[message.main_ID].listen_port,
          path: '/action',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const req = require('http').request(options, (res) => {
          console.log(`STATUS: ${res.statusCode}`);
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
          });
        });
        req.on('error', (e) => {
          console.error(`problem with request: ${e.message}`);
        });
        req.write(JSON.stringify(message));
        req.end();

        console.log("Message sent to plugin : " + message.main_ID);
      }

    }
    //ws.send(`${message}`);
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
  if (!db[req.body.main_ID]) {
    db[req.body.main_ID] = {
      type : req.body.type,
      main_ID : req.body.main_ID,
      actions : req.body.actions,
      text : req.body.text,
      position : req.body.position,
      status : req.body.status,
      listen_port : req.body.listen_port,
      entities : {}
    };
  }
  else {
    // update each entity key, or add it if it does not exist
    for (const key in req.body) {
      if (key !== "main_ID" && key !== "serial") {
        db[req.body.main_ID][key] = req.body[key];
      }
    }
  }
  
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

  // add data to db.json file
  db = require("./db.json");
  if (!db[req.body.main_ID]) {
    console.log("No main_ID found in db.json");
  }
  if (!db[req.body.main_ID].entities[req.body.serial]) {
    db[req.body.main_ID].entities[req.body.serial] = req.body;
  } else {
    // update each entity key, or add it if it does not exist
    for (const key in req.body) {
      if (key !== "main_ID" && key !== "serial") {
        db[req.body.main_ID].entities[req.body.serial][key] = req.body[key];
      }
    }
  }

  wss_clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send("DATABASE"+JSON.stringify(db));
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
