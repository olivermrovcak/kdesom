import React, {useEffect, useRef, useState} from 'react';
// @ts-ignore
import arrow from "../images/arrow.png";
import {useNavigate} from "react-router-dom";
import StreetViewService = google.maps.StreetViewService;
import AdvancedMarkerElement = google.maps.Marker;
import PinElement = google.maps.Marker;
import {useAppDispatch, useAppSelector} from '../hooks/hooks';

import {setGameActive} from '../redux/slices/GameState'


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

function Game() {
    const navigate = useNavigate();
    const [tries, setTries] = useState(1);
    const [points, setPoints] = useState(0);
    const [markerPos, setMarkerPos] = useState<any>();
    const [sVCoords, setSVCoords] = useState<any>();
    const [submited, setSubmited] = useState(false);
    const [markers, setMarkers] = useState<any>([]);
    const [lines, setLines] = useState<any>([]);

    const submitedRef = useRef(submited); // Create a ref to track the latest value of submited

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
            fullscreenControl: false
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
            scaledSize: new google.maps.Size(40, 40),  // Adjust size as needed
        };

        const marker2 = new google.maps.Marker({
            map: map,
            icon: markerIcons,  // Use the custom SVG icon
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
        getRandomView();
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


    function getRandomView(): void {
        const service = new StreetViewService();

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
            console.log(plat, plng)

            if (pointInPolygon([plat, plng], arr)) {
                break;
            }
        }

        const streetViewRequest = {
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

        return parseFloat(distance.toFixed(2)) / 1000;
    }

    function calculateCenter(lat1: number, lng1: number, lat2: number, lng2: number): { lat: number, lng: number } {
        const centerLat = (lat1 + lat2) / 2;
        const centerLng = (lng1 + lng2) / 2;
        return {lat: centerLat, lng: centerLng};
    }

    function calculatePoints(distance: number): number {
        return 5000 - Math.round(distance * 10);
    }

    function handleDone() {
        console.log(markerPos?.lat(), markerPos?.lng())
        console.log(sVCoords?.lat(), sVCoords?.lng())

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
            handleReset();
            navigate('/dashboard')
        }
    }

    function handleReset() {
        removeMarkers();
        removeLines();
        setMarkerPos(null)
        getRandomView();
        setSubmited(false);
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
        <div className="App flex flex-col justify-center  items-center w-screen h-screen relative ">
            <section className="w-full h-full relative">
                <div
                    className="!absolute !z-[1000] top-3 left-[50%] -translate-x-[50%] w-52 p-3 bg-blue-300 rounded-lg text-center">
                    Skóre: {points}
                </div>
                <div className="w-full h-full rounded-lg  z-0 " id="street-view"></div>
                <div
                    className="rounded-md w-[20%] h-[20%] hover:w-[60%] hover:h-[45%] transition-all ease-in-out duration-300 bg-blue-200 bottom-10 left-10 absolute ">
                    <div
                        className="absolute !z-[1000] right-5 top-5 bg-blue-300 rounded-lg p-1 flex justify-center items-center">
                        <p className="">{tries}</p>
                    </div>

                    <div id="map" className="w-full h-full rounded-md">
                    </div>
                    {markerPos && (
                        <button
                            onClick={() => handleDone()}
                            className="w-28 h-8 border  rounded-md bg-blue-700 text-white absolute z-1 bottom-4  left-[50%] -translate-x-[50%] transition-all ease-in-out duration-300">
                            Done
                        </button>
                    )}

                    {submited && (
                        <button
                            onClick={() => handleReset()}
                            className="w-28 h-8 border  rounded-md bg-blue-700 text-white absolute z-1 bottom-4  left-[50%] -translate-x-[50%] transition-all ease-in-out duration-300">
                            Reset
                        </button>
                    )}
                </div>
                <div
                    className="absolute top-5 left-5 w-10 h-10 z-1 rotate-180 arrow cursor-pointer hover:scale-125  transition-all">
                    <img onClick={() => handleGoBack()} src={arrow} alt="arrow-back "/>
                </div>
            </section>
        </div>
    );
}

export default Game;
