import * as L from '../../lib/leaflet/leaflet-src.esm.js';

//Map Stuff
const map = L.map('birdMap').setView([14.599512,120.984222],5);
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const mapTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(mapTiles, {attribution});
tiles.addTo(map);

let api_link_main = 'https://api.ebird.org/v2/data/obs/PH/recent';
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
                console.log(json[0]); //Test Data

                let marker = L.marker([json[99].lat,json[99].lng]).addTo(map); //Bird Marker
                marker.bindPopup(
                    '<center>'+json[99].comName+'</center>'+
                    '<br><center>'+json[99].sciName+'</center>');

                let marker2 = L.marker([json[120].lat,json[120].lng]).addTo(map); //Bird Marker
                marker2.bindPopup(
                    '<center>'+json[120].comName+'</center>'+
                    '<br><center>'+json[120].sciName+'</center>');
            })
    })
    .catch(function(error) {
        console.error('COULD NOT RETRIEVE QUERY');
    });



