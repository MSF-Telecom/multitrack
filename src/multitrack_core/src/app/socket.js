const socket = new WebSocket('ws://localhost:8001');

socket.onopen = function (event) {
  console.log('You are Connected to WebSocket Server');

  // set border of controls to green
  document.getElementById('controls').style.border = '1px solid green';
};

socket.onmessage = function (event) {
  var object = JSON.parse(event.data);
  // check if object contains "position" key
  if (object.position) {
    setMarkerPosition(object);
    updateMarkers();
  }
  // check if object contains "text" key
  if (object.text) {
    setNewText(object);
  }
  // check if object contains "status" key
  if (object.status) {
    setNewStatus(object);
  }
  else {
    console.log('Unknown object type');
  }
  updateControls();
  console.log('Message from server: ', object);
};


socket.onclose = function (event) {
  console.log('Disconnected from WebSocket server');

  // set border of controls to red
  document.getElementById('controls').style.border = '1px solid red';
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
  // check if marker exists
  // if (markers[object.main_ID+"_"+object.serial]) {
  //   markers[object.main_ID+"_"+object.serial].setLngLat([object.position.longitude, object.position.latitude])
  // }
  // else {
  //   markers[object.main_ID+"_"+object.serial] = new maplibregl.Marker()
  //     .setLngLat([object.position.longitude, object.position.latitude])
  //     .setPopup(popup)
  //     .addTo(map);
  // }
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
}