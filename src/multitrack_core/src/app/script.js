console.log('Hello from script.js!')

const popup2 = new maplibregl.Popup({ offset: 25 }).setHTML(
  'Test popup2 : <a href="http://crouton.net">link</a>'
);

let radios = {
  "main-id_sn0000": {
    "main_ID": "main-id",
    "type": "type",
    "model" : "model",
    "serial": "sn0000",
    "last_updated": "1743518674",
    "position": {
      "latitude": 50.8335,
      "longitude": 4.36464
    },
    "text": "text",
    "status": "status",
  }
};

let markers = {};
let selectedKeys = [];

function updateControls() {
  const controls = document.getElementById('controls');

  // check if and which divs are selected
  const ControlsDivs = document.querySelectorAll('.radio_controls');
  const selectedDivs = [];
  ControlsDivs.forEach(function (div) {
    if (div.classList.contains('selected')) {
      selectedDivs.push(div);
    }
  });
  selectedDivs.forEach(function (div) {
    const key = div.classList[1];
    selectedKeys.push(key);
  });

  controls.innerHTML = '';
  for (const key in radios) {
    const radio = radios[key];
    // check if controls has div tag with id = radio.main_ID
    // if it does not, create it
    // if it does, update it
    if (!document.getElementById(radio.main_ID)) {
      const div = document.createElement('div');
      div.id = radio.main_ID;
      controls.appendChild(div);
    }

    const div = document.createElement('div');
    
    div.className = 'radio_controls';
    div.classList.add(key);
    // if (selectedKeys.includes(key)) {
    //   div.classList.add('selected');
    // }
    div.id = radio.main_ID;
    div.innerHTML = `
      <h3>${radio.main_ID}</h3>
      Type: ${radio.type} Model: ${radio.model} Serial: ${radio.serial}<br>
      Last updated: ${radio.last_updated} Position: ${radio.position.latitude}, ${radio.position.longitude}<br>
      Text: ${radio.text} Status: ${radio.status}
    `;
    div.onclick = function () {
      

      // if "selected is not in classlist, add "selected" class to d
      // else remove "selected" class from div
      if (div.classList.contains('selected')) {
        div.classList.remove('selected');
        selectedKeys = selectedKeys.filter(item => item !== key);
      } else {
        div.classList.add('selected');
      }

      checkSelectedControls(div, radio, key);
    };
    controls.appendChild(div);
    console.log('div class', div.classList);
    // simulate a click on the div if it is selected
    if (selectedKeys.includes(key)) {
      div.click();
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
  for (const key in radios) {
    const radio = radios[key];
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