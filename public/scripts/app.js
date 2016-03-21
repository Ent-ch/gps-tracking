var mymap = L.map('mapid').setView([48.61, 35.32], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZW50Y2giLCJhIjoiY2ltMXN0bTI5MDBsY3V4bTRnbm96dTB1YiJ9.C7LkuHIyaoUW7KcJTNBbSw'
}).addTo(mymap);



$.get( "/api/last-position", function( data ) {
  var date = new Date(data.ts * 1000);
  L.marker(data.cords).addTo(mymap).bindPopup('Time:' + date).openPopup();
  console.log(data);
});

$.get( "/api/track", function( data ) {
  var polyline = L.polyline(data.cords, {color: 'red'}).addTo(mymap);
  console.log(data);
});
