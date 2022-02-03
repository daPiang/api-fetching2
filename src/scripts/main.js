import * as L from '../../lib/leaflet/leaflet-src.esm.js';

//Map Stuff
const map = L.map('birdMap', {
    minZoom: 5
});
    map.setView([14.599512,120.984222],5);

const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const mapTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(mapTiles, {attribution});
    tiles.addTo(map);

let bird_array = [];
let markers = [];

//API Stuff
let api_link_main = 'https://api.ebird.org/v2/data/obs/PH/recent?back=30';
let api_link_reg = 'https://api.ebird.org/v2/ref/region/info/PH';
let bird_link = 'https://ebird.org/species/';

let myHeaders = new Headers();
myHeaders.append("X-eBirdApiToken", "1qlibos60jhf");

let requestOptions = {
	method: 'GET',
	headers: myHeaders,
	redirect: 'follow'
};

fetch(api_link_reg, requestOptions)
    .then(function(response) {
        if(!response.ok) {
            console.error('ERROR CODE'+response.status);
            return;
        }
        response.json()
            .then(function(json) {
                console.log(json); //Region Data
            })
    })
    .catch(function(error) {
        console.error('COULD NOT RETRIEVE REGION DATA');
    });

fetch(api_link_main, requestOptions)
    .then(function(response) {
        if(!response.ok) {
            console.error('ERROR CODE'+response.status);
            return;
        }
        response.json()
            .then(function(json) {
                console.log(json); //Our Actual Data

                let prev = '';
                let count = 0;
                for (let i = 0; i < 50; i++) {
                    if (prev==json[i+count].locName) {
                        i--;
                        count+=1;
                        continue;
                    }

                    bird_array.push([
                        json[i+count].lat,
                        json[i+count].lng,
                        '<center class=\'common-name\'>'+json[i+count].comName+'</center><center class=\'sci-name\'>'+json[i].sciName+'</center><center><a href='+bird_link+json[i].speciesCode+' target=\'_blank\'>Learn More</a></center>',
                        json[i+count].locName,
                        json[i+count].comName,
                        json[i+count].sciName
                    ]);

                    let lat = bird_array[i][0];
                    let lng = bird_array[i][1];
                    let popupText = bird_array[i][2];

                    let marker_loc = new L.LatLng(lat, lng);
                    let marker = new L.Marker(marker_loc);
                    map.addLayer(marker);

                    marker.bindPopup(popupText);
                    markers.push(marker);
                    prev = json[i+count].locName;
                }
            })
    })
    .catch(function(error) {
        console.error('COULD NOT RETRIEVE QUERY');
    });

//EventListeners
let button_count = 0;

document.getElementById('buttonNEXT').addEventListener("click", function() {
    if (button_count==49) {
        button_count=0;
    }
    map.setView([bird_array[button_count][0],bird_array[button_count][1]],15);
    markers[button_count].openPopup();
    button_count++;
});

document.getElementById('buttonPREV').addEventListener("click", function() {
    if (button_count==-1) {
        button_count=49;
    }
    map.setView([bird_array[button_count][0],bird_array[button_count][1]],15);
    markers[button_count].openPopup();
    button_count--;
});
