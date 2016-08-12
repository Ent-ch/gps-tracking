let mymap = L.map('mapid').setView([48.61, 35.32], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZW50Y2giLCJhIjoiY2ltMXN0bTI5MDBsY3V4bTRnbm96dTB1YiJ9.C7LkuHIyaoUW7KcJTNBbSw',
}).addTo(mymap);



$.get( "/api/stops", function( data ) {
  let rows = [];

  rows = data.map((el, i) => Object.assign({},
    {
      id: el.id, device: el.device, ts: el.start_time,
      dur: (new Date(el.stop_time) - new Date(el.start_time)) / 60000,
      pos: L.marker([el.lat, el.lon]),
    }
  ));

  $('#stops-table').WATable({
    data: {
      cols: {
        id: {
          index: 1,
          type: "number",
          friendly: "Num",
          unique: true,
        },
        device: {
          index: 2,
          type: "string",
          friendly: "Device",
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
      let date = new Date(data.row.ts);
      if (!data.column.name) {
        if (data.checked) {
          mymap.addLayer(data.row.pos);
        } else {
          mymap.removeLayer(data.row.pos);
        }
      }
    },
  });

});

$.get( "/api/last-position", function( data ) {
  let date = new Date(data.ts);
  L.marker(data.cords).addTo(mymap).bindPopup('Time:' + date + ' Speed:' + data.speed + ' Orient:' + data.orientation).openPopup();
  // console.log(data);
});

$.get( "/api/tracks", function( data ) {
  let selectedTracks = [];
  // let polyline = L.polyline(data.cords, {color: 'red'}).addTo(mymap);
  // console.log(data);
    $('#tracks-table').WATable({
    data: {
      cols: {
        id: {
          index: 1,
          type: "number",
          friendly: "Num",
          unique: true,
        },
        device: {
          index: 2,
          type: "string",
          friendly: "Device",
        },
        distance: {
          index: 3,
          type: "number",
          friendly: "Distance",
        },
        start_time: {
          index: 4,
          type: "date",
          friendly: "Start",
        },
        stop_time: {
          index: 5,
          type: "date",
          friendly: "End",
        },
      },

      rows: data,
    },
    checkboxes: true,
    checkAllToggle: false,
    rowClicked: function(data) {
      $.get(`/api/tracks/${data.row.id}`, (data) => {
        let polyline = L.polyline(data, {color: 'red'}).addTo(mymap);
      })
      // let date = new Date(data.row.ts);
      // if (!data.column.name) {
      //   if (data.checked) {
      //     mymap.addLayer(data.row.pos);
      //   } else {
      //     mymap.removeLayer(data.row.pos);
      //   }
      // }
    },
  });

});

