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
            })
    })
    .catch(function(error) {
        console.error('COULD NOT RETRIEVE QUERY');
    });