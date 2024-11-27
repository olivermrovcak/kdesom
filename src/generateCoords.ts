import StreetViewService = google.maps.StreetViewService;

interface LatLngLiteral {
    lat: number;
    lng: number;
}

function getRandomCoords() {
    const slovakiaBounds = {
        north: 49.6131,
        south: 47.7314,
        east: 22.5503,
        west: 16.8471,
    };

    let lat = Math.random() * (slovakiaBounds.north - slovakiaBounds.south) + slovakiaBounds.south;
    let lng = Math.random() * (slovakiaBounds.east - slovakiaBounds.west) + slovakiaBounds.west;

    return {lat, lng}
}

function checkIfAvailable(service: any, coords: LatLngLiteral, json: any) {


    const streetViewRequest = {
        location: {lat: coords.lat, lng: coords.lng},
        radius: 1.1, // Set a radius of 50 meters to check for Street View panorama
    };

    service.getPanoramaByLocation(streetViewRequest, 1000, (data: any, status: any) => {

        if (status == "OK") {
            console.log(status + " " + "{lat:" + coords.lat + ", lng:" + coords.lng + "}")
            json.data.push(coords)
            return true;
        }
        return false;
    })

    return false;
}

async function getJson() {

    const myJson = {data: []}; // create a new JSON object

    var count = 0;
    const service = new StreetViewService();


    for (let i = 0; i < 500; i++) {
        var x = getRandomCoords()

        if (checkIfAvailable(service, x, myJson)) {
            count++;
        }
    }
}

getJson();

export {getJson};