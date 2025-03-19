
let protocol = new pmtiles.Protocol({ metadata: true });
maplibregl.addProtocol("pmtiles", protocol.tile);

const map = new maplibregl.Map({
  container: "map",
  zoom: 7,
  center: [4.36464, 50.8335],
  style: {
    version: 8,
    sources: {
      example_source: {
        type: "vector",
        // For standard Z/X/Y tile APIs or Z/X/Y URLs served from go-pmtiles, replace "url" with "tiles" and remove all the pmtiles-related client code.
        // tiles: ["https://example.com/{z}/[x}/{y}.mvt"],
        // see https://maplibre.org/maplibre-style-spec/sources/#vector
        url: "pmtiles://http://127.0.0.1:3000/belgium.pmtiles",
      },
    },
    layers: [
      {
        id: "water",
        source: "example_source",
        "source-layer": "water",
        filter: ["==", ["geometry-type"], "Polygon"],
        type: "fill",
        paint: {
          "fill-color": "#80b1d3",
        },
      },
      {
        id: "buildings",
        source: "example_source",
        "source-layer": "buildings",
        type: "fill",
        paint: {
          "fill-color": "#d9d9d9",
        },
      },
      {
        id: "roads",
        source: "example_source",
        "source-layer": "roads",
        type: "line",
        paint: {
          "line-color": "#fc8d62",
        },
      },
      {
        id: "pois",
        source: "example_source",
        "source-layer": "pois",
        type: "circle",
        paint: {
          "circle-color": "#ffffb3",
        },
      },
    ],
    minZoom: 3,
    maxPitch: 0,
  },
});
//map.showTileBoundaries = true;

const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
  'Test popup : <a href="http://crouton.net">link</a>'
);
const marker = new maplibregl.Marker()
  .setLngLat([4.36464, 50.8335])
  .setPopup(popup)
  .addTo(map);

map.addControl(
  new maplibregl.NavigationControl({
    visualizePitch: true,
    visualizeRoll: true,
    showZoom: true,
    showCompass: true,
  })
);

map.on("zoom", (e) => {
  if (map.transform.zoom > 17) {
    map.setZoom(17);
  }
  if (map.transform.zoom < 7) {
    map.setZoom(7);
    map.setCenter([4.36464, 50.8335]);
  }
});