import React, {useEffect, useRef, useState} from 'react';
import arrow from "../images/arrow.png";
import {useNavigate} from "react-router-dom";
import StreetViewService = google.maps.StreetViewService;
import AdvancedMarkerElement = google.maps.Marker;
import PinElement = google.maps.Marker;
import {useAppDispatch, useAppSelector} from '../hooks/hooks';
import {villages} from '../coordinates/villages'
import guessLogo from '../images/guess-logo.png';


import {setGameActive} from '../redux/slices/GameState'
import {Button} from '@material-tailwind/react';
import Dialog from './Dialog';
import {calculateCenter} from '../utils/utils';

import {MapIcon, XCircleIcon} from '@heroicons/react/24/solid'


let panorama: google.maps.StreetViewPanorama;
let map: google.maps.Map;


interface Village {
    village: [lat: number, lng: number];
}


interface Coordinates {
    latitude: number;
    longitude: number;
}

interface LatLngLiteral {
    lat: number;
    lng: number;
}

function Game() {
    const navigate = useNavigate();
    const [tries, setTries] = useState(1);
    const [points, setPoints] = useState(0);
    const [markerPos, setMarkerPos] = useState<any>();
    const [sVCoords, setSVCoords] = useState<any>();
    const [submited, setSubmited] = useState(false);
    const [markers, setMarkers] = useState<any>([]);
    const [lines, setLines] = useState<any>([]);

    //dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isMapOpened, setIsMapOpened] = useState(false);

    const [currentVillage, setCurrentVillage] = useState<String>("");

    const service = new StreetViewService();
    const geocoder = new google.maps.Geocoder();

    const submitedRef = useRef(submited); // Create a ref to track the latest value of submited

    function handleCloseDialog() {
        setIsDialogOpen(false);
    }

    useEffect(() => {
        submitedRef.current = submited; // Update the ref whenever submited changes
    }, [submited]);

    //redux
    const isGameActive = useAppSelector((state) => state.gameState.gameActive)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setGameActive(true))

        initMap();
        initializeStreetView();
    }, []);

    function initMap(): void {
        const mapOptions: google.maps.MapOptions = {
            center: {lat: 48.77559816437337, lng: 19.61552985351171},
            zoom: 7,
            mapTypeControl: false, // disable the map type control
            zoomControl: false, // disable the zoom control
            streetViewControl: false, // disable the street view control
            fullscreenControl: false,
            styles: [
                {
                    featureType: "administrative",
                    elementType: "labels",
                    stylers: [{visibility: "off"}]
                },
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{visibility: "off"}]
                },
            ]
        };
        map = new google.maps.Map(
            document.getElementById('map') as HTMLElement,
            mapOptions
        );
        const pinSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4285F4">
            <path d="M480-600q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm0-80q25 0 42.5-17.5T540-740q0-25-17.5-42.5T480-800q-25 0-42.5 17.5T420-740q0 25 17.5 42.5T480-680Zm0 600L240-320q-20-20-30-45t-10-55q0-59 40.5-99.5T340-560q29 0 53.5 11t44.5 31l42 42 42-42q20-20 44.5-31t53.5-11q59 0 99.5 40.5T760-420q0 30-10 55t-30 45L480-80Zm0-114 182-182q9-9 13.5-20.5T680-420q0-24-17-42t-43-18q-12 0-21.5 3.5T580-464L480-364 380-464q-6-6-15.5-11t-24.5-5q-26 0-43 18t-17 42q0 12 5 22.5t13 19.5l182 184Zm0-546Zm0 403Z"/>
          </svg>`;

        const markerIcons = {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(pinSvg),
            scaledSize: new google.maps.Size(40, 40),
        };

        const marker2 = new google.maps.Marker({
            map: map,
            icon: markerIcons,
            title: "Custom SVG Marker",
        });

        const markerSv = new google.maps.Marker({
            map: map,
        });

        map.addListener("click", (event) => {
            if (submitedRef.current) {  // Access the latest value of submited using the ref
                return
            }
            marker2.setMap(map)
            setMarkers([...markers, marker2, markerSv])
            setMarkerPos(event.latLng)
            marker2.setPosition(event.latLng);
            console.log(event.latLng.lat(), event.latLng.lng(),)
        });
    }

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
        getView()
    }

    function pointInPolygon(point: [any, any], polygon: [any, any][]): boolean {
        let inside = false;
        const x = point[0], y = point[1];

        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {

            const xi = polygon[i][0], yi = polygon[i][1];
            const xj = polygon[j][0], yj = polygon[j][1];

            const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi) / (yj - yi)) + xi);
            console.log(intersect)
            if (intersect) inside = !inside;
        }
        return inside;
    }

    function toggleMapOpen() {
        setIsMapOpened(!isMapOpened)
    }

    function getRandomView(): void {
        const arr = [
            [48.42611411652761, 16.83737757631693],
            [48.88343206217704, 17.20406701097706],
            [49.42430824496527, 18.939213431223518],
            [49.22135317633194, 19.730396207596602],
            [49.421683573627554, 21.11943107057624],
            [49.389191787782956, 21.884697981604962],
            [49.052199531094736, 22.538913798919374],
            [48.40544965144248, 22.136980002078875],
            [48.56920497495687, 21.411369400319067],
            [48.30156692973986, 20.399756749248784],
            [48.249926756557294, 19.601090269419938],
            [47.84701097641858, 18.79991533457215],
            [47.77349403313184, 17.914522332393027],
            [48.03946809804529, 17.08930468671376],
            [48.62163567242417, 16.9306671213369]
        ] as any;

        const slovakiaBounds = {
            north: 49.6131,
            south: 47.7314,
            east: 22.5503,
            west: 16.8471,
        };

        let plat;
        let plng;

        while (true) {
            plat = Math.random() * (slovakiaBounds.north - slovakiaBounds.south) + slovakiaBounds.south;
            plng = Math.random() * (slovakiaBounds.east - slovakiaBounds.west) + slovakiaBounds.west;
            if (pointInPolygon([plat, plng], arr)) {
                break;
            }
        }

        geocoder.geocode({address: "Slovakia"}, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results[0]) {
                const location = results[0].geometry.location;

                console.log(location)

                const streetViewRequest: google.maps.StreetViewLocationRequest = {
                    location: location,  // LatLng object from geocoding
                    source: google.maps.StreetViewSource.OUTDOOR,
                    radius: 5000
                };

                service.getPanorama(streetViewRequest, (data: google.maps.StreetViewPanoramaData | null, status: google.maps.StreetViewStatus) => {
                    if (status === google.maps.StreetViewStatus.OK && data) {
                        setSVCoords(data?.location?.latLng);
                        console.log(data);
                        panorama.setPano(data?.location?.pano as any);
                    } else {
                        console.error('No Street View data available for this location.');
                    }
                });
            } else {
                console.error('Geocoding failed: ' + status);
            }
        });

        /* const streetViewRequest = {
             location: {lat: plat, lng: plng},
             source: google.maps.StreetViewSource.OUTDOOR,
             radius: 5000
         };

         service.getPanorama(streetViewRequest, (data: any, status: any) => {
             if (status == "OK") {
                 setSVCoords(data.location.latLng)
                 console.log(data)
                 panorama.setPano(data.location.pano)
             }
         })*/
    }

    function getView() {
        const arr: any = villages

        const randomIndex = Math.floor(Math.random() * arr.length);
        const randomVillage = arr[randomIndex];

        console.log(randomVillage)

        setCurrentVillage(randomVillage)

        getPanoramaByDescription(randomVillage)
    }

    function getPanoramaByDescription(description: string) {
        geocoder.geocode({address: description}, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results[0]) {
                const location = results[0].geometry.location;

                const streetViewRequest: google.maps.StreetViewLocationRequest = {
                    location: location,  // LatLng object from geocoding result
                    source: google.maps.StreetViewSource.OUTDOOR,
                    radius: 5000
                };

                service.getPanorama(streetViewRequest, (data: google.maps.StreetViewPanoramaData | null, status: google.maps.StreetViewStatus) => {
                    if (status === google.maps.StreetViewStatus.OK && data) {
                        setSVCoords(data?.location?.latLng);
                        console.log(data);
                        panorama.setPano(data?.location?.pano as any);
                    } else {
                        console.error('No Street View data available for this location.');
                    }
                });
            } else {
                console.error('Geocoding failed: ' + status);
            }
        });
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

        return parseFloat(distance.toFixed(2)) / 1000;
    }

    function calculatePoints(distance: number): number {
        return 5000 - Math.round(distance * 10);
    }

    function handleDone() {
        const stViewLat: number = sVCoords?.lat();
        const stViewLng: number = sVCoords?.lng();

        const markerLat: number = markerPos?.lat();
        const markerLng: number = markerPos?.lng();

        map?.setZoom(6);
        markers[1].setMap(map);
        markers[1].setPosition({lat: stViewLat, lng: stViewLng});

        const coordinates = [
            {lat: markerLat, lng: markerLng},
            {lat: stViewLat, lng: stViewLng},

        ];

        const polyline = new google.maps.Polyline({
            path: coordinates,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });
        const distance = calculateDistance(stViewLat, stViewLng, markerLat, markerLng);
        setPoints(points + calculatePoints(distance))
        console.log("Distance points: ", calculatePoints(distance))
        setTries(tries + 1)
        setLines([...lines, polyline])
        polyline.setMap(map);
        map.setCenter(calculateCenter(stViewLat, stViewLng, markerLat, markerLng));
        setSubmited(true);

        if (tries === 5) {
            console.log("Game over")
        }

        setIsDialogOpen(true)
        setIsMapOpened(false)
    }

    function handleReset() {
        removeMarkers();
        removeLines();
        setMarkerPos(null)
        getView()
        setSubmited(false);
        setIsDialogOpen(false)
        setIsMapOpened(false)
    }

    function removeMarkers() {
        for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }

    function removeLines() {
        for (let i = 0; i < lines.length; i++) {
            lines[i].setMap(null);
        }
    }

    function handleGoBack() {
        navigate('/')
    }

    return (
        <div className="App flex flex-col justify-center  items-center w-screen h-screen relative overflow-hidden ">
            <section className="w-screen h-screen relative overflow-hidden">

               <div className="logo absolute left-[50%] top-5 -translate-x-[50%] sm:-translate-x-[0%] sm:left-5  lg:top-5 lg:left-5 w-[30%] sm:w-[15%] !z-[1000]">
                    <img src={guessLogo} alt="logo"/>
                </div>
                <div
                    className="!absolute !z-[1000] top-14 sm:top-5  left-[50%] -translate-x-[50%] w-32 sm:w-52 p-3 bg-blue-500 rounded-lg text-center flex flex-col">
                    <p className="font-bold text-xl italic">{points}</p>
                    <p className="text-sm">{currentVillage}</p>
                </div>

                <div className={`slider sm:hidden absolute left-0  w-screen 
                h-[50%] bg-blue-500 !z-[1000] rounded-t-[30px] transition-all ease-in-out duration-300
                ${isMapOpened ? "bottom-[50%] translate-y-[100%]" : "bottom-0 translate-y-[100%] "}`}>
                    <div className="absolute right-5 top-5 !z-[1000]">
                        <XCircleIcon className="w-10 h-10 text-white m-2 bg-blue-500 rounded-full" onClick={() => setIsMapOpened(false)}/>
                    </div>
                    <div id="map" className="w-full h-full rounded-t-[30px]">
                    </div>
                    <div className="absolute bottom-0 w-full p-5 ">
                        <Button
                            className="text-bold text-md text-white"
                            onClick={() => handleDone()}
                            fullWidth
                            color="blue"
                        >
                            Guess
                        </Button>
                    </div>
                </div>

                <div className="w-screen h-screen z-0 " id="street-view"></div>

                <div id="map" className="hidden lg:block lg:absolute  left-5 bottom-20 w-[20%]
                h-[10%] md:h-[20%] rounded-lg  md:hover:w-[35%] hover:w-[70%]
                hover:h-[30%] transition-all ease-in-out duration-300">
                </div>

                <div onClick={toggleMapOpen} className="absolute lg:hidden left-10 bottom-10 w-24 h-24 sm:w-36 sm:h-36 rounded-full cursor-pointer  select-none  p-1 bg-gray-200 bg-opacity-50    flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-blue-300 flex items-center justify-center ">
                        <MapIcon className="w-24 h-24 text-white m-6"/>
                    </div>
                </div>
                <div className="absolute left-5 bottom-5 w-[20%]">
                    {(markerPos && !submited) && (
                        <Button
                            className="text-bold text-md text-white"
                            onClick={() => handleDone()}
                            fullWidth
                            color="blue"
                        >
                            Guess
                        </Button>
                    )}
                    {submited && (
                        <Button
                            onClick={() => handleReset()}
                            fullWidth
                            color="blue"
                        >
                            Next
                        </Button>
                    )}
                </div>

            </section>
            <Dialog showDialog={isDialogOpen} closeDialog={handleCloseDialog} posPlayer={markerPos} posResult={sVCoords}
                    handleReset={handleReset}/>
        </div>
    );
}

export default Game;
