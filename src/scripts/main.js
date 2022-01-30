import * as L from '../../lib/leaflet/leaflet-src.esm.js';

//Map Stuff
const map = L.map('birdMap').setView([14.599512,120.984222],7);
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const mapTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(mapTiles, {attribution});
tiles.addTo(map);

let markers = [];

//API Stuff
let api_link_main = 'https://api.ebird.org/v2/data/obs/PH/recent?back=30';
let api_link_reg = 'https://api.ebird.org/v2/ref/region/info/PH';

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
    })

fetch(api_link_main, requestOptions)
    .then(function(response) {
        if(!response.ok) {
            console.error('ERROR CODE'+response.status);
            return;
        }
        response.json()
            .then(function(json) {
                console.log(json); //Our Actual Data
                // console.log(json[0]); //Test Data

                //TODO: Fix Same Marker Location
                for (let i = 0; i < 10; i++) {
                    markers.push([
                        json[i].lat,
                        json[i].lng,
                        '<center>'+json[i].comName+'</center><br><center>'+json[i].sciName+'</center>',
                        json[i].locName
                    ]);
                    
                    let lat = markers[i][0];
                    let lng = markers[i][1];
                    let popupText = markers[i][2];

                    let marker_loc = new L.LatLng(lat, lng);
                    let marker = new L.Marker(marker_loc);
                    map.addLayer(marker);

                    marker.bindPopup(popupText);
                    console.log('Loop '+(i+1));
                    console.log(markers);
                }
            })
    })
    .catch(function(error) {
        console.error('COULD NOT RETRIEVE QUERY');
    });



