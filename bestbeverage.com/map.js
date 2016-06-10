mapboxgl.accessToken = 'pk.eyJ1IjoiYmVzdGJldmVyYWdlIiwiYSI6ImNpcDdsc3g2cTAxNDh0Y2x5czA1dmlpMncifQ.8jilQ5MUy-OfJktXcC014A';
  var map = new mapboxgl.Map({
    container: 'map',
    // style: 'mapbox://styles/mapbox/light-v9',
    style: 'mapbox://styles/bestbeverage/cip8x37d40033ahnf7bnjvbin',
    center: [-96, 37.8],
    zoom: 3, // starting zoom
    minZoom: 3,
    maxZoom: 3
  });

  // Disable drag and zoom handlers.
map.boxZoom.disable();
map.dragPan.disable();
map.dragRotate.disable();
map.keyboard.disable();
map.doubleClickZoom.disable();
map.touchZoomRotate.disable();
map.scrollZoom.disable();

  map.on('load', function () {

    Y.io('/location-map/?format=json', {
        headers: {
            'Content-Type': 'application/json',
        },
        on: {
            complete: function (id,e) {
                // console.log('e',e);
                var locationMap = JSON.parse(e.responseText);
                // console.log('locationMap',locationMap);
                var locations = locationMap.items;
                var geojson = {"type":"geojson", "data": {"type":"FeatureCollection","features":[]}};
                Y.each(locations, function (locationData, locationIndex) {
                    var coordinates = [locationData.location.markerLng,locationData.location.markerLat];
                    var location = {"type":"Feature","geometry":{"type":"Point","coordinates":coordinates},"properties":{"title":locationData.title,"description":locationData.body}};
                    // console.log('location',location);
                    geojson.data.features.push(location);
                });
                // console.log('geojson',geojson);
                map.addSource("markers", geojson);

                map.addLayer({
                    "id": "markers",
                    "type": "symbol",
                    "source": "markers",
                    "layout": {
                        // "icon-image": "{marker-symbol}-15",
                        "icon-image": "circle-15",
                        "text-field": "{title}",
                        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                        "text-offset": [0, 0.6],
                        "text-anchor": "top"
                    },
                    "paint": {
                        "icon-color": "#FE5400",
                        "text-color": "#01C8FC"
                    }
                });
            }
        }

    });

    /*map.addSource("markers", {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-77.03238901390978, 38.913188059745586]
                },
                "properties": {
                    "title": "Mapbox DC",
                    "marker-symbol": "monument",
                    "description": "<div class=\"marker-title\">Make it Mount Pleasant</div><p><a href=\"http://www.mtpleasantdc.com/makeitmtpleasant\" target=\"_blank\" title=\"Opens in a new window\">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>"
                }
            }, {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-122.414, 37.776]
                },
                "properties": {
                    "title": "Mapbox SF",
                    "marker-symbol": "alcohol-shop",
                    "description":"Apple To Rev Up Siri At WWDC But Amazon Echo Rival May Wait | Stock News & Stock Market Analysis - IBD"

                }
            }]
        }
    });
*/

});


// When a click event occurs near a marker icon, open a popup at the location of
// the feature, with description HTML from its properties.
map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['markers'] });

    if (!features.length) {
        return;
    }

    var feature = features[0];

    // Populate the popup and set its coordinates
    // based on the feature found.
    var popup = new mapboxgl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML(feature.properties.description)
        .addTo(map);
});

// Use the same approach as above to indicate that the symbols are clickable
// by changing the cursor style to 'pointer'.
map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['markers'] });
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : 'default';
});