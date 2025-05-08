console.log('Hello from script.js!')

const popup2 = new maplibregl.Popup({ offset: 25 }).setHTML(
  'Test popup2 : <a href="http://crouton.net">link</a>'
);

// let radios = {
//   "main-id_sn0000": {
//     "main_ID": "main-id",
//     "type": "type",
//     "model" : "model",
//     "serial": "sn0000",
//     "last_updated": "1743518674",
//     "position": {
//       "latitude": 50.8335,
//       "longitude": 4.36464
//     },
//     "text": "text",
//     "status": "status"
//   }
// };

let db = {
  "main-id": {
    "type": "identify_plugin",
    "main_ID": "main-id",
    "actions": ["different", "actions", "here"],
    "text": true,
    "position": true,
    "status": true,
    "entities": {
      "sn0000" : {
        "type": "device",
        "model": "model",
        "serial": "sn0000",
        "last_updated": "1743518674",
        "position": {
          "latitude": 50.8335,
          "longitude": 4.36464
        },
        "text" : "Hello world",
        "status" : "alive"
      }
    }
  }
};

let markers = {};
let selectedKeys = [];

function updateControls() {
  const controls = document.getElementById('controls');
  controls.innerHTML = '';

  for (const plugin_id in db) {
    const plugin = db[plugin_id];
    for (const key in plugin.entities) {
      const radio = plugin.entities[key];
      const div = document.createElement('div');
      div.className = 'radio_controls';
      div.classList.add(key);
      div.id = plugin_id + "_" + radio.serial;

      // Build elements without using innerHTML
      const header = document.createElement('h3');
      header.textContent = `${plugin_id}_${radio.serial}`;
      div.appendChild(header);

      div.appendChild(document.createTextNode(`Type: ${radio.type} Model: ${radio.model} Serial: ${radio.serial}`));
      div.appendChild(document.createElement('br'));

      div.appendChild(document.createTextNode(`Last updated: ${radio.last_updated} Position: ${radio.position.latitude}, ${radio.position.longitude}`));
      div.appendChild(document.createElement('br'));

      div.appendChild(document.createTextNode(`Text: ${radio.text} Status: ${radio.status}`));
      div.appendChild(document.createElement('br'));

      if (db[plugin_id].actions) {
        const actionContainer = document.createElement('div');
        actionContainer.id = 'action_buttons';
        actionContainer.innerText = 'Actions: ';

        db[plugin_id].actions.forEach(function (action) {
          const button = document.createElement('button');
          button.className = 'action_button';
          button.id = `${plugin_id}_${radio.serial}_${action}`;
          button.innerText = action;
          button.onclick = function () {
            const message = {
              message_type: 'device_action',
              main_ID: radio.main_ID,
              serial: radio.serial,
              action: action
            };
            console.log('Sending message:', message);
            socket.send(JSON.stringify(message));
          };
          actionContainer.appendChild(button);
        });
        div.appendChild(actionContainer);
      }

      if (db[plugin_id].text) {
        const textDiv = document.createElement('div');
        textDiv.id = 'text_field';
        textDiv.innerText = 'Text: ';

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'text_input';
        input.placeholder = 'Enter text message';

        const sendButton = document.createElement('button');
        sendButton.id = 'text_button';
        sendButton.innerText = 'Send';
        sendButton.onclick = function () {
          const message = {
            message_type: 'device_text',
            main_ID: radio.main_ID,
            serial: radio.serial,
            text: input.value
          };
          console.log('Sending message:', message);
          socket.send(JSON.stringify(message));
        };

        textDiv.appendChild(input);
        textDiv.appendChild(sendButton);
        div.appendChild(textDiv);
      }

      div.onclick = function () {
        if (div.classList.contains('selected')) {
          div.classList.remove('selected');
          selectedKeys = selectedKeys.filter(item => item !== key);
        } else {
          div.classList.add('selected');
        }
        checkSelectedControls(div, radio, key);
      };

      controls.appendChild(div);

      if (selectedKeys.includes(key)) {
        div.click();
      }
    }
  }
}

function checkSelectedControls(div, radio, key) {
  const radioControlDivs = document.querySelectorAll('.radio_controls');
  // remove "selected" class from all divs except the one calling this function
  radioControlDivs.forEach(function (radioControlDiv) {
    if (radioControlDiv !== div) {
      radioControlDiv.classList.remove('selected');
      selectedKeys = selectedKeys.filter(item => item !== radioControlDiv.classList[1]);
    }
  });

  

  for (const markerKey in markers) {
    setMarkerColor(markers[markerKey], '#3FB1CE');
  };

  radioControlDivs.forEach(function (radioControlDiv) {
    if (radioControlDiv.classList.contains('selected')) {
      radioControlDiv.style.backgroundColor = '#6c6c6c';
      if (markers[key]) {
        setMarkerColor(markers[key], '#FF0000');
      }
    }
    else {
      radioControlDiv.style.backgroundColor = '';
    }
  });
}

function selectControlsDiv(set, key) {
  const radioControlDivs = document.querySelectorAll('.radio_controls');
  radioControlDivs.forEach(function (radioControlDiv) {
    
    if(radioControlDiv.classList.contains(key)) {
      if(set) {
        radioControlDiv.classList.add('selected');
      } else {
        radioControlDiv.classList.remove('selected');
      }
      checkSelectedControls(radioControlDiv, radios[key], key);
    }
  });
}


function updateMarkers() {
  for (const plugin_id in db) {
    const plugin = db[plugin_id];
    for (const key in plugin.entities) {
      const radio = plugin.entities[key];
      if (!markers[key]) {
        const markerPopup = new maplibregl.Popup({ offset: 25 }).setHTML(
          `${radio.main_ID} : ${radio.type} ${radio.model} ${radio.serial}`
        )
        markerPopup.on('open', function () {
          selectControlsDiv(true, key);
        });
        markerPopup.on('close', function () {
          selectControlsDiv(false, key);
        });

        markers[key] = new maplibregl.Marker()
          .setLngLat([radio.position.longitude, radio.position.latitude])
          .setPopup(markerPopup)
          .addTo(map);
      } else {
        markers[key].setLngLat([radio.position.longitude, radio.position.latitude]);
      }
    }
  }
}

function setMarkerColor(marker, color) {
  let markerElement = marker.getElement();
  markerElement
    .querySelectorAll('svg g[fill="' + marker._color + '"]')[0]
    .setAttribute("fill", color);
  marker._color = color;
};

updateControls();

setTimeout(() => {
  markers["WolStPi"] = new maplibregl.Marker()
    .setLngLat([4.46464, 50.8335])
    .setPopup(popup2)
    .addTo(map);
  updateMarkers();
}, 1000);