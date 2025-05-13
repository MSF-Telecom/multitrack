let socket = new WebSocket('ws://localhost:8001');

socket.onopen = function (event) {
  console.log('You are Connected to WebSocket Server');

  // set border of controls to green
  document.getElementById('controls').style.border = '1px solid green';
};

socket.onmessage = function (event) {
  // check if message begins with "DATABASE"
  if (event.data.startsWith("DATABASE")) {
    // get the database
    var database = event.data.split("DATABASE")[1];
    // parse the database
    var database = JSON.parse(database);
    // check if database is empty
    if (Object.keys(database).length === 0) {
      console.log('Database is empty');
      return;
    }
    db = database;
    // var object = JSON.parse(event.data);
    // // check if object contains "position" key
    // if (object.position) {
    //   setMarkerPosition(object);
    //   updateMarkers();
    // }
    // // check if object contains "text" key
    // if (object.text) {
    //   setNewText(object);
    // }
    // // check if object contains "status" key
    // if (object.status) {
    //   setNewStatus(object);
    // }
    // // check if object contains "actions" key
    // if (object.actions) {
    //   setNewActions(object);
    // }

    updateControls();
    updateMarkers();
    console.log('Message from server: ', database);
  }
};


socket.onclose = function (event) {
  console.log('Disconnected from WebSocket server');

  // set border of controls to red
  document.getElementById('controls').style.border = '1px solid red';

  // try to reconnect every 5 seconds
  setTimeout(function () {
    socket = new WebSocket('ws://localhost:8001');
  }, 5000);
};

// Function to send a message
//  to the WebSocket server
function sendMessage() {
  // Get the message input element
  const messageInput = document
    .getElementById('messageInput');
  // Get the value of
  // the message input
  const message = messageInput.value;
  // Send the message to 
  // the WebSocket server
  socket.send(message);
  // Clear the message input
  messageInput.value = '';
}

function setMarkerPosition(object) {
  if(!radios[object.main_ID+"_"+object.serial]) {
    radios[object.main_ID+"_"+object.serial] = object;
  }
  else {
    radios[object.main_ID+"_"+object.serial].position = object.position;
  }
}

function setNewText(object) {
  // handle text
  console.log(object.main_ID+"_"+object.serial + " : " + object.text);
  if(!radios[object.main_ID+"_"+object.serial]) {
    radios[object.main_ID+"_"+object.serial] = object;
  }
  else {
    radios[object.main_ID+"_"+object.serial].text = object.text;
  }

  // check if position exists
  if(!radios[object.main_ID+"_"+object.serial].position) {
    radios[object.main_ID+"_"+object.serial].position = {
      latitude: NaN,
      longitude: NaN
    };
  }
}

function setNewStatus(object) {
  // handle status
  console.log(object.main_ID+"_"+object.serial + " : " + object.status);
  if(!radios[object.main_ID+"_"+object.serial]) {
    radios[object.main_ID+"_"+object.serial] = object;
  }
  else {
    radios[object.main_ID+"_"+object.serial].status = object.status;
  }

  // check if position exists
  if(!radios[object.main_ID+"_"+object.serial].position) {
    radios[object.main_ID+"_"+object.serial].position = {
      latitude: NaN,
      longitude: NaN
    };
  }
}

function setNewActions(object) {
  // handle actions
  console.log(object.main_ID+"_"+object.serial + " : " + object.actions);
  if(!radios[object.main_ID+"_"+object.serial]) {
    radios[object.main_ID+"_"+object.serial] = object;
  }
  else {
    radios[object.main_ID+"_"+object.serial].actions = object.actions;
  }
  // check if position exists
  if(!radios[object.main_ID+"_"+object.serial].position) {
    radios[object.main_ID+"_"+object.serial].position = {
      latitude: NaN,
      longitude: NaN
    };
  }
}