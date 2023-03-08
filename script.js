/*--------------------------------------------------------------------
GGR472 Lab 3: Adding Styling and interactivity to web maps with Javascript
Adding elements to the map
--------------------------------------------------------------------*/

//Defining an access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZGVuZ3RvciIsImEiOiJjbGN2N2VueHowd2xuM3JwNWUwYmppYTg4In0.wS0qJyacGyqRQkNoP7fnmw'; 

//Initializing my map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/dengtor/clez5rttr002h01nzj1sf1itx', // Style created in Mapbox studio
    center: [-79.3, 42.6],
    zoom: 3,
    maxBounds: [
        [-80.2, 43.4], // Southwest most extent of my web map
        [-78.5, 44.0]  // Northeast most extent of my web map
    ],
});


/*--------------------------------------------------------------------
ADDING MAPBOX CONTROLS AS ELEMENTS ON MAP
--------------------------------------------------------------------*/
//Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

//Add fullscreen option to the map 
map.addControl(new mapboxgl.FullscreenControl());

//Create geocoder variable
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: "ca"
});

//Use geocoder div to position geocoder on page
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));



/*--------------------------------------------------------------------
ADD DATA AS CHOROPLETH MAP ON MAP LOAD
Use get expression to categorise data based on the predicted 2021 population values of the Toronto neighborhoods
--------------------------------------------------------------------*/
//Add data source and draw initial visiualization of layer
map.on('load', () => {
    map.addSource('canada-provterr', {
        'type': 'vector',
        'url': 'dengtor.95q8b9ji'
    });

    map.addLayer({
        'id': 'provterr-fill',
        'type': 'fill',
        'source': 'canada-provterr',
        'paint': {
            'fill-color': [
                'step', // STEP expression produces stepped results based on value pairs and help in making of your legend labels
                ['get', 'F2021_Population_Projection'], // GET expression retrieves property value from 'capacity' data field
                '#880808', // Colour assigned to any values < first step
                7223, '#AA4A44', // Colours assigned to values >= each step
                28133, '#EE4B2B',
                49043, '#A52A2A',
                69953, '#800020'
            ],
            'fill-opacity': 0.5,
            'fill-outline-color': 'white'
        },
        'source-layer': 'neighbourhood-crime-rates-1m1qyp'
    });

});



/*--------------------------------------------------------------------
CREATE LEGEND IN JAVASCRIPT
--------------------------------------------------------------------*/
//Declare arrayy variables for labels and colours
const legendlabels = [
    '0-7223',
    '7223-28,133',
    '28,133-49,043',
    '49,043-69,953',
    '>69,953'
];

const legendcolours = [
    '#880808',
    '#AA4A44',
    '#EE4B2B',
    '#A52A2A',
    '#800020'
];

//Declare legend variable using legend div tag
const legend = document.getElementById('legend');

//For each layer create a block to put the colour and label in
legendlabels.forEach((label, i) => {
    const color = legendcolours[i];

    const item = document.createElement('div'); //each layer gets a 'row' - this isn't in the legend yet, we do this later
    const key = document.createElement('span'); //add a 'key' to the row. A key will be the color circle

    key.className = 'legend-key'; //the key will take on the shape and style properties defined in css
    key.style.backgroundColor = color; // the background color is retreived from teh layers array

    const value = document.createElement('span'); //add a value variable to the 'row' in the legend
    value.innerHTML = `${label}`; //give the value variable text based on the label

    item.appendChild(key); //add the key (color cirlce) to the legend row
    item.appendChild(value); //add the value to the legend row

    legend.appendChild(item); //add row to the legend
});



/*--------------------------------------------------------------------
ADD INTERACTIVITY BASED ON HTML EVENT
--------------------------------------------------------------------*/

//Add event listeneer which returns map view to full screen on button click
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-105, 58],
        zoom: 3,
        essential: true
    });
});

//Change display of legend based on check box
let legendcheck = document.getElementById('legendcheck');

legendcheck.addEventListener('click', () => {
    if (legendcheck.checked) {
        legendcheck.checked = true;
        legend.style.display = 'block';
    }
    else {
        legend.style.display = "none";
        legendcheck.checked = false;
    }
});


//Change map layer display based on check box using setlayoutproperty
document.getElementById('layercheck').addEventListener('change', (e) => {
    map.setLayoutProperty(
        'provterr-fill',
        'visibility',
        e.target.checked ? 'visible' : 'none'
    );
});


