let mymap = L
    .map('mapid')
    .setView([
      48.61, 35.32,
    ], 10),
  stopsTable,
  tracksTable;

$(document).ready(function () {
  L
    .tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery © ' +
        '<a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZW50Y2giLCJhIjoiY2ltMXN0bTI5MDBsY3V4bTRnbm96dTB1YiJ9.C7LkuHIyaoUW7KcJ' +
        'TNBbSw',
  })
    .addTo(mymap);

  $.get("/api/devices", function (data) {
    let rows = [];

    console.log(data);

    rows = data.map((el, i) => {
      dat = Object.assign({}, {
        id: el.id,
        device: el.device,
        ts: el.created_at,
        pos: {
          lat: el.lat,
          lon: el.lon,
          orient: el.orientation,
          speed: el.speed,
        },
        orient: el.orientation,
        speed: el.speed,
        compass: el.compass,
      });
      return dat;
    });

    $('#devices-table').WATable({
      data: {
        cols: {
          device: {
            index: 1,
            type: "string",
            friendly: "Device",
            unique: true,
          },
          ts: {
            index: 2,
            type: "date",
            friendly: "Last cords time",
          },
          pos: {
            index: 3,
            type: "string",
            friendly: "Position",
            hidden: true,
          },
          speed: {
            index: 4,
            type: "number",
            friendly: "Speed",
          },
          orient: {
            index: 5,
            type: "number",
            friendly: "Orientation",
          },
          compass: {
            index: 6,
            type: "string",
            friendly: "Compass",
          },
        },
        rows: rows,
      },
      checkboxes: false,
      checkAllToggle: false,
      rowClicked: function (data) {
        let pos = data.row.pos,
          trackMarker = L.trackSymbol(L.latLng(pos.lat, pos.lon), {
            trackId: 123,
            fill: true,
            fillColor: '#0033ff',
            fillOpacity: 0.5,
            speed: pos.speed,
            course: pos.orient,
            heading: pos.orient,
            compass: data.compass,
          });
        console.log(pos);
        trackMarker.addTo(mymap);

        setInterval(function () {
          // mymap.removeLayer(trackMarker);
          $
            .get("/api/last-position", function (data) {
              let trackMarker = L.trackSymbol(L.latLng(data.lat, data.lon), {
                trackId: 123,
                fill: true,
                fillColor: '#0033ff',
                fillOpacity: 0.5,
                speed: data.speed,
                course: data.orientation,
                heading: data.orientation,
                // compass: data.compass,
              });
              trackMarker.addTo(mymap);
            });
        }, 3000);
      },
    });
  });

  $.get("/api/stops", function (data) {
    let rows = [];

    rows = data.map((el, i) => Object.assign({}, {
      id: el.id,
      device: el.device,
      ts: el.start_time,
      dur: (new Date(el.stop_time) - new Date(el.start_time)) / 60000,
      pos: L.marker([el.lat, el.lon]),
    }));

    stopsTable = $('#stops-table').WATable({
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
            index: 3,
            type: "date",
            friendly: "Time",
          },
          dur: {
            index: 4,
            type: "number",
            friendly: "Duration",
          },
          pos: {
            index: 5,
            type: "string",
            friendly: "Position",
            hidden: true,
          },
        },
        rows: rows,
      },
      checkboxes: true,
      checkAllToggle: true,
      columnClicked: function (data) {
        console.log('col click', data);
      },
      rowClicked: function (data) {
        console.log('row clicked', data);
      },
    }).data('WATable');
  });

  $.get("/api/tracks", function (data) {
    let selectedTracks = [];
    tracksTable = $('#tracks-table').WATable({
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
      checkAllToggle: true,
      rowClicked: function (data) {
        $.get(`/api/tracks/${data.row.id}`, (data) => {
          let polyline = L
            .polyline(data, {color: 'red'})
            .addTo(mymap);
        })
        let date = new Date(data.row.ts);
        if (!data.column.name) {
          if (data.checked) {
            mymap.addLayer(data.row.pos);
          } else {
            mymap.removeLayer(data.row.pos);
          }
        }
      },
    }).data('WATable');
  });
});

function showHideStops(show) {
  let selStops = stopsTable
    .getData(show)
    .rows;
  selStops.forEach(function (element) {
    if (show) {
      mymap.addLayer(element.pos);
    } else {
      mymap.removeLayer(element.pos);
    }
  });
}

function showTracks() {
  console.log('showTracks');
}

function hideTracks() {
  console.log('hideTracks');
}