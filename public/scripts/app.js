var mymap = L.map('mapid').setView([48.61, 35.32], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZW50Y2giLCJhIjoiY2ltMXN0bTI5MDBsY3V4bTRnbm96dTB1YiJ9.C7LkuHIyaoUW7KcJTNBbSw'
}).addTo(mymap);



$.get( "/api/stops", function( data ) {
  var rows = [];
  data.forEach(function (elem) {
    // var date = new Date(elem[0][2] * 1000);
    // L.marker([elem[0][0], elem[0][1]]).addTo(mymap).bindPopup('Time:' + date + ' Duration:' + elem[1] + ' sec.');
  });
  rows = data.map((el, i) => Object.assign({}, {id: ++i, ts: el[0][2] * 1000, dur: el[1] / 60, pos: L.marker([el[0][0], el[0][1]])}));
  // console.log(rows);
  $('#stops-table').WATable({
    data: {
      cols: {
        id: {
          index: 1,
          type: "number",
          friendly: "Num",
          unique: true,
        },
        ts: {
          index: 2,
          type: "date",
          friendly: "Time",
        },
        dur: {
          index: 3,
          type: "number",
          friendly: "Duration",
        },
        pos: {
          index: 4,
          type: "string",
          friendly: "Position",
          hidden: true,
        },
      },
      rows: rows,
    },
    checkboxes: true,
    checkAllToggle: false,
    rowClicked: function(data) {
      // console.log('row clicked', data);
      var date = new Date(data.row.ts);
      if (!data.column.name) {
        if (data.checked) {
          mymap.addLayer(data.row.pos);
        } else {
          mymap.removeLayer(data.row.pos);
        }
      }
      // L.marker(data.row.pos).addTo(mymap).bindPopup('Time:' + date + ' Duration:' + data.row.dur + ' min.');
    },
  });
});

$.get( "/api/last-position", function( data ) {
  var date = new Date(data.ts);
  L.marker(data.cords).addTo(mymap).bindPopup('Time:' + date + ' Speed:' + data.speed + ' Orient:' + data.orientation).openPopup();
  // console.log(data);
});

$.get( "/api/track", function( data ) {
  var polyline = L.polyline(data.cords, {color: 'red'}).addTo(mymap);
  console.log(data);
});

