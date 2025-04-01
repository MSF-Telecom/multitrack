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

function updateControls() {
  const controls = document.getElementById('controls');
  controls.innerHTML = '';
  for (const key in radios) {
    const radio = radios[key];
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${radio.main_ID}</h3>
      <p>Type: ${radio.type}</p>
      <p>Model: ${radio.model}</p>
      <p>Serial: ${radio.serial}</p>
      <p>Last updated: ${radio.last_updated}</p>
      <p>Position: ${radio.position.latitude}, ${radio.position.longitude}</p>
      <p>Text: ${radio.text}</p>
      <p>Status: ${radio.status}</p>
    `;
    controls.appendChild(div);
  }
}

function updateMarkers() {
  for (const key in radios) {
    const radio = radios[key];
    if (!markers[key]) {
      markers[key] = new maplibregl.Marker()
        .setLngLat([radio.position.longitude, radio.position.latitude])
        .setPopup(popup2)
        .addTo(map);
    } else {
      markers[key].setLngLat([radio.position.longitude, radio.position.latitude]);
    }
  }
}

setTimeout(() => {
  markers["WolStPi"] = new maplibregl.Marker()
    .setLngLat([4.46464, 50.8335])
    .setPopup(popup2)
    .addTo(map);
}, 1000);