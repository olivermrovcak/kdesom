import React, {useEffect, useState} from 'react';


import StreetViewService = google.maps.StreetViewService;
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
    const [submited, setSubmited] = useState(false);
    const [markers, setMarkers] = useState<any>([]);
    const [lines, setLines] = useState<any>([]);

    useEffect(() => {
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
            marker.setMap(map)
            setMarkers([...markers, marker,markerSv])
            setMarkerPos(event.latLng)
            marker.setPosition(event.latLng);
            console.log(event.latLng.lat(),event.latLng.lng(), )
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
           [ 48.42611411652761, 16.83737757631693 ],
           [ 48.88343206217704 , 17.20406701097706 ],
           [ 49.42430824496527, 18.939213431223518 ],
           [ 49.22135317633194, 19.730396207596602 ],
           [ 49.421683573627554,21.11943107057624 ],
           [ 49.389191787782956,21.884697981604962 ],
           [ 49.052199531094736,22.538913798919374 ],
           [ 48.40544965144248,22.136980002078875 ],
           [ 48.56920497495687,21.411369400319067 ],
           [ 48.30156692973986, 20.399756749248784 ],
           [ 48.249926756557294, 19.601090269419938 ],
           [ 47.84701097641858, 18.79991533457215],
           [ 47.77349403313184,  17.914522332393027],
           [ 48.03946809804529, 17.08930468671376],
           [ 48.62163567242417, 16.9306671213369]
        ] as any;


        const slovakiaBounds = {
            north: 49.6131,
            south: 47.7314,
            east: 22.5503,
            west: 16.8471,
        };

        let plat ;
        let plng ;

        while(true) {
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

        return parseFloat(distance.toFixed(2))/1000;
    }

    function calculateCenter(lat1: number, lng1: number, lat2: number, lng2: number): { lat: number, lng: number } {
        const centerLat = (lat1 + lat2) / 2;
        const centerLng = (lng1 + lng2) / 2;
        return { lat: centerLat, lng: centerLng };
    }


    function handleDone() {
        console.log(markerPos?.lat(),markerPos?.lng())
        console.log(sVCoords?.lat(),sVCoords?.lng())

        const stViewLat: number = sVCoords?.lat();
        const stViewLng: number = sVCoords?.lng();

        const markerLat: number = markerPos?.lat();
        const markerLng: number = markerPos?.lng();

        map?.setZoom(6);
        markers[1].setMap(map);
        markers[1].setPosition({lat: stViewLat, lng: stViewLng});

        const coordinates = [
            { lat: markerLat, lng: markerLng },
            { lat: stViewLat, lng: stViewLng },

        ];

        const polyline = new google.maps.Polyline({
            path: coordinates,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });
        setLines([...lines, polyline])
        polyline.setMap(map);
        map.setCenter(calculateCenter(stViewLat,stViewLng,markerLat,markerLng));
        setSubmited(true);

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

    return (
        <div className="App flex flex-col justify-center  items-center w-screen h-screen ">

            <div>

            </div>


                <section className="w-full h-full relative">

                    <div className="w-full h-full rounded-lg  z-0 " id="street-view"></div>
                    <div
                        className="rounded-md w-[20%] h-[20%] hover:w-[60%] hover:h-[45%] transition-all ease-in-out duration-300 bg-blue-200 bottom-10 left-10 absolute ">

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


                </section>





        </div>
    );
}

export default App;
