console.log('Hello from script.js!')

const popup2 = new maplibregl.Popup({ offset: 25 }).setHTML(
  'Test popup2 : <a href="http://crouton.net">link</a>'
);

let markers = {};

setTimeout(() => {
  markers["WolStPi"] = new maplibregl.Marker()
    .setLngLat([4.46464, 50.8335])
    .setPopup(popup2)
    .addTo(map);
}, 1000);