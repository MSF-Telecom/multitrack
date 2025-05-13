var express = require("express");
var app = express();

const PORT = process.env.PORT || 3000;

var port = PORT;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.static("maps"));

app.get("/", function (req, res) {
  // Serve the GUI from app folder
  // Also serve .css and .js files
  
  res.send("Hello World from Map tile server !");
});

app.listen(port, function () {
  console.log("Listening on port " + port);
});