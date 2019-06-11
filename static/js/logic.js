// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL


d3.json(queryUrl , d => {
  console.log(d);

  arr = d.features;
  sortedMag = arr.sort((a,b) => a.properties.mag - b.properties.mag).map(d=>d.properties.mag);

  console.log(sortedMag);

  color = d3.scaleLinear()
  .domain([0, sortedMag.length-1])
  .range(["yellow", "red"]);
  console.log(sortedMag.indexOf(-0.66))

  function getColor(d, val) {
    console.log(d, color(val.indexOf(d)));
    return color(val.indexOf(d))
  }

  function getSize(d) {
    if (d<0) {return d*(-5)}
    else return d*5
  }



  function onEachFeature(feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>"+
      "<p> Magnitude: "+ feature.properties.mag + "</p>");
  }

  function createCustomMarkers(feature, latlng) {
    return new L.CircleMarker(latlng, {radius: getSize(feature.properties.mag), 
      fillOpacity: 0.6, 
      weight: 1,
      color: getColor(feature.properties.mag, sortedMag)});
  }

//builds our geojson layer
  var earthquakes = L.geoJSON(d.features, {
    pointToLayer: createCustomMarkers,
    onEachFeature: onEachFeature
  });

  createMap(earthquakes)

})


var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});





function createMap(some_layer) {

  // Define streetmap and darkmap layers
  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": satellite,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: some_layer
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [satellite, some_layer]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

};