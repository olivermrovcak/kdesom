import React, {useState} from 'react';


import StreetViewService = google.maps.StreetViewService;
import {Browser} from "leaflet";
import safari = Browser.safari;
let panorama: google.maps.StreetViewPanorama;
let map: google.maps.Map;

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface LatLngLiteral {
    lat: number;
    lng: number;
}

function App() {

    const [markerPos, setMarkerPos] = useState<any>();
    const [sVCoords, setSVCoords] = useState<any>();


    function initMap(): void {
        const mapOptions: google.maps.MapOptions = {
            center: {lat: 46.528634, lng: 2.438963},
            zoom: 2,
            mapTypeControl: false, // disable the map type control
            zoomControl: false, // disable the zoom control
            streetViewControl: false, // disable the street view control
            fullscreenControl: false
        };
         map  = new google.maps.Map(
            document.getElementById('map') as HTMLElement,
            mapOptions
        );
        const markerIcon = {
            url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 10,
        };

        const marker = new google.maps.Marker({
            map: map,
            icon: markerIcon,
        });

        const markerSv = new google.maps.Marker({
            map: map,
            icon: markerIcon,
        });

        map.addListener("click", (event) => {

            setMarkerPos(event.latLng)
            marker.setPosition(event.latLng);
        });
    }

    window.addEventListener('load', initMap);

    function initializeStreetView() {
        panorama = new google.maps.StreetViewPanorama(
            document.getElementById("street-view") as HTMLElement,
            {
                pov: {heading: 165, pitch: 0},
                zoom: 1,
                addressControl: false,
                linksControl: true,
                panControl: true,
                enableCloseButton: false,
                disableDefaultUI: true,
                showRoadLabels: false,

            }
        );


        getRandomView();


    }


    window.addEventListener('load', initializeStreetView);


    function getRandomView(): void {
        const service = new StreetViewService();


        const slovakiaBounds = {
            north: 49.6131,
            south: 47.7314,
            east: 22.5503,
            west: 16.8471,
        };

        let plat = Math.random() * (slovakiaBounds.north - slovakiaBounds.south) + slovakiaBounds.south;
        let plng = Math.random() * (slovakiaBounds.east - slovakiaBounds.west) + slovakiaBounds.west;

        const streetViewRequest = {
            location: {lat: plat, lng: plng},
            source: google.maps.StreetViewSource.OUTDOOR,
            radius: 5000

        };

        service.getPanorama(streetViewRequest, (data: any, status: any) => {

            if (status == "OK") {
                setSVCoords(data.location.latLng)
                panorama.setPano(data.location.pano)

            }
        })
    }
    function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number, unit: string = "km"): number {
        const R = unit === "km" ? 6371e3 : 3960e3;
        const phi1 = (lat1 * Math.PI) / 180;
        const phi2 = (lat2 * Math.PI) / 180;
        const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
        const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c;

        return parseFloat(distance.toFixed(2))/1000;
    }

    function calculateCenter(lat1: number, lng1: number, lat2: number, lng2: number): { lat: number, lng: number } {
        const centerLat = (lat1 + lat2) / 2;
        const centerLng = (lng1 + lng2) / 2;
        return { lat: centerLat, lng: centerLng };
    }


    function handleDone() {
        console.log(markerPos?.lat(),markerPos?.lng()  )
        console.log(sVCoords?.lat(),sVCoords?.lng()  )

        const stViewLat: number = sVCoords?.lat();
        const stViewLng: number = sVCoords?.lng();

        const markerLat: number = markerPos?.lat();
        const markerLng: number = markerPos?.lng();

        map.setZoom(6);


        const markerIcon = {
            url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 10,
        };

        const markerSv = new google.maps.Marker({
            map: map,
            icon: markerIcon,
            position: {lat: stViewLat, lng: stViewLng}
        });

        const coordinates = [
            { lat: markerLat, lng: markerLng },
            { lat: stViewLat, lng: stViewLng },

        ];

// Create the polyline
        const polyline = new google.maps.Polyline({
            path: coordinates,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });

// Add the polyline to the map
        polyline.setMap(map);


        map.setCenter(calculateCenter(stViewLat,stViewLng,markerLat,markerLng))

        console.log(calculateDistance(stViewLat, stViewLng, markerLat, markerLng) );
    }

    return (
        <div className="App flex flex-col justify-center  items-center w-screen h-screen ">


            <section className="w-[80%] h-[80%] relative">

                <div className="w-full h-full rounded-lg  z-0 " id="street-view"></div>
                <div
                    className="rounded-md w-36 h-36 hover:w-[60%] hover:h-[45%] transition-all ease-in-out duration-300 bg-blue-200 bottom-10 left-10 absolute ">

                    <div id="map" className="w-full h-full rounded-md">

                    </div>

                    {markerPos && (
                        <button
                            onClick={() => handleDone()}
                            className="w-28 h-8 border  rounded-md bg-blue-700 text-white absolute z-1 bottom-4  left-[50%] -translate-x-[50%] transition-all ease-in-out duration-300">
                            Done
                        </button>
                    )}

                </div>


            </section>


        </div>
    );
}

export default App;
