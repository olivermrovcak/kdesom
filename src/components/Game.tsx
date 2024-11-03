import React, {useCallback, useEffect, useRef, useState} from 'react';
import arrow from "../images/arrow.png";
import {useNavigate} from "react-router-dom";
import StreetViewService = google.maps.StreetViewService;
import AdvancedMarkerElement = google.maps.Marker;
import PinElement = google.maps.Marker;
import {useAppDispatch, useAppSelector} from '../hooks/hooks';
import guessLogo from '../images/guess-logo.png';
import compasss from '../images/compass.png';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';


import {setGameActive} from '../redux/slices/GameState'
import {Button} from '@material-tailwind/react';
import Dialog from './Dialog';
import {MapIcon, XCircleIcon} from '@heroicons/react/24/solid'
import {GamemodeEnum} from '../utils/GamemodeEnum';

import {PanoramaService} from '../coordinates/Geolocation';
import GameResultDialog from './GameResultDialog';
import MenuList from './MenuList';
let panorama: google.maps.StreetViewPanorama;
let map: google.maps.Map;


function Game() {
    const navigate = useNavigate();
    const [tries, setTries] = useState(1);
    const [points, setPoints] = useState(0);
    const [markerPos, setMarkerPos] = useState<any>();
    const [sVCoords, setSVCoords] = useState<any>();
    const [submited, setSubmited] = useState(false);
    const [markers, setMarkers] = useState<any>([]);
    const [lines, setLines] = useState<any>([]);
    const [roundPoints, setRoundPoints] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    //UI
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isMapOpened, setIsMapOpened] = useState(false);
    const [isGameResultDialogOpen, setIsGameResultDialogOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [currentLocationDesc, setCurrentLocationDesc] = useState<String>("");

    // Initialize geocoder and street view service
    const service = new google.maps.StreetViewService();
    const geocoder = new google.maps.Geocoder();

    // Initialize PanoramaService
    const panoramaService = new PanoramaService(geocoder, service);

    const submitedRef = useRef(submited);

    //gamemode
    const [gameMode, setGameMode] = useState<GamemodeEnum>(GamemodeEnum.SVK_EASY);

    //redux
    const isGameActive = useAppSelector((state) => state.gameState.gameActive)
    const dispatch = useAppDispatch()

    function handleCloseDialog() {
        setIsDialogOpen(false);
    }

    function handleCloseGameResultDialog() {
        setIsGameResultDialogOpen(false)
    }

    useEffect(() => {
        submitedRef.current = submited;
    }, [submited]);

    useEffect(() => {
        dispatch(setGameActive(true))
        initMap();
        initializeStreetView();
    }, [gameMode]);

    function initGame() {
        setGameMode(GamemodeEnum.SVK_EASY)
    }

    function getStartingZoom() {
        if (gameMode === GamemodeEnum.SVK_EASY || gameMode === GamemodeEnum.SVK_HARD) {
            return 7;
        } else {
            return 1.5;
        }
    }

    function initMap(): void {
        const mapOptions: google.maps.MapOptions = {
            center: {lat: 48.77559816437337, lng: 19.61552985351171},
            zoom: getStartingZoom(),
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

        map = new google.maps.Map(document?.getElementById('map') as HTMLElement, mapOptions);

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
            marker2.setMap(map)
            setMarkers([...markers, marker2, markerSv])
            setMarkerPos(event.latLng)
            marker2.setPosition(event.latLng);
        });
    }


    function initializeStreetView() {
        panorama = new google.maps.StreetViewPanorama(
            document.getElementById("street-view") as HTMLElement,
            {
                pov: {heading: 165, pitch: 0},
                zoom: 1,
                addressControl: false,
                linksControl: false, //movement
                panControl: false,
                enableCloseButton: false,
                disableDefaultUI: true,
                showRoadLabels: false,
                clickToGo: true            // Disables clicking to navigate to other locations
            }
        );

        getView()
    }

    function toggleMapOpen() {
        setIsMapOpened(!isMapOpened)
    }

    async function getView() {
        try {
            setIsLoading(true)
            let pano: string | null = null;

            console.log("Game mode: ", gameMode)

            if (gameMode === GamemodeEnum.SVK_EASY) {
                pano = await panoramaService.getSvkVillagePanorama((data: any, village: string) => {
                    console.log("Data: ", data)
                    setSVCoords(data?.location?.latLng);
                    console.log("Village: ", village)
                    setCurrentLocationDesc(village);
                });
            } else {
                pano = await panoramaService.getCountryPanorama((data: any, country: string) => {
                    console.log("Data: ", data)
                    setSVCoords(data?.location?.latLng);
                    setCurrentLocationDesc(country);
                });
            }

            if (typeof pano === 'string') {
                console.log("pano:", pano);
                panorama.setPano(pano);
                setIsLoading(false)
            } else {
                console.error("Failed to retrieve a valid panorama ID.");
            }
        } catch (error) {
            console.error("Error loading panorama:", error);
        }
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
        const points = 5000 - Math.round(distance * 10);
        return points > 0 ? points : 0;
    }

    function handleDone() {
        const stViewLat: number = sVCoords?.lat();
        const stViewLng: number = sVCoords?.lng();

        const markerLat: number = markerPos?.lat();
        const markerLng: number = markerPos?.lng();

        const distance = calculateDistance(stViewLat, stViewLng, markerLat, markerLng);
        const actualPoints = calculatePoints(distance);
        setPoints(points + actualPoints)
        console.log("Distance points: ", calculatePoints(distance))
        setSubmited(true);

        setRoundPoints(actualPoints)
        setIsDialogOpen(true)
        setIsMapOpened(false)
    }

    function handleReset() {
       /* if (tries === 3) {
            console.log("Game over")
            setIsGameResultDialogOpen(true)
            setIsDialogOpen(false)
            return
        }*/
        setIsDialogOpen(false)
        setTries(tries + 1)
        setRoundPoints(0);
        removeMarkers();
        removeLines();
        setMarkerPos(null)
        getView()
        setSubmited(false);
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

    function handleChangeGameMode(dGameMode: GamemodeEnum) {
        setGameMode(dGameMode);
    }

    return (
        <div className="App flex flex-col justify-center  items-center w-screen h-screen relative overflow-hidden bg-black">
            <section className="w-screen h-screen relative overflow-hidden">
                {isLoading && (
                    <div className="w-screen h-screen bg-blue-700 flex justify-center items-center bg-opacity-30 transition-all">
                        <div className="w-32">
                            <img className="animate-spin " src={compasss}/>
                        </div>
                    </div>
                )}

                <div
                    className="logo absolute left-[50%] top-5 -translate-x-[50%] sm:-translate-x-[0%] sm:left-5  lg:top-5 lg:left-5 w-[30%] sm:w-[15%] !z-[1000]">
                    <img src={guessLogo} alt="logo"/>
                </div>
                <div
                    className={`!z-[1000] absolute right-5 top-16 sm:top-5 bg-blue-700 bg-opacity-30 
                rounded-lg p-1  transition-all duration-300 ease-in-out overflow-hidden flex flex-col justify-center items-center
                ${isMenuOpen ? "w-64 h-52" : "w-14 h-14"}`}>
                    <div className="bg-blue-500 rounded-md w-full h-full p-1">
                        <div className={`${isMenuOpen ? "w-full h-fit justify-end" : "w-full h-full justify-center"} flex items-center `}>
                            <SportsEsportsIcon onClick={()=> setIsMenuOpen(!isMenuOpen)} className="text-white "  />
                        </div>
                        <MenuList changeGamemode={handleChangeGameMode}/>
                    </div>
                </div>
                <div
                    className="!absolute !z-[1000] top-14 sm:top-5  left-[50%] -translate-x-[50%] w-32 sm:w-52 p-1 bg-blue-700   bg-opacity-50   rounded-lg ">
                    <div className="bg-blue-500 p-2 rounded-md flex flex-col text-center">
                        <p className="font-bold text-xl italic text-white">{points}</p>
                        <p className="text-sm">{gameMode === GamemodeEnum.SVK_EASY && currentLocationDesc}</p>
                    </div>
                </div>

                <div className="w-screen h-screen z-0 " id="street-view"></div>

                <div className={`w-full h-[50%] md:w-[20%] md:h-[20%] bg-blue-300 bottom-0 rounded-t-[30px] md:rounded-md absolute 
                                 transition-all ease-in-out duration-300 
                                 md:hover:w-[35%] md:hover:h-[30%]
                                         ${isMapOpened ? "bottom-[50%] translate-y-[100%] md:bottom-20 md:left-5 md:translate-y-0" : "bottom-0 translate-y-[100%] md:bottom-20 md:left-5 md:translate-y-0 "}`}>
                    <div id="map" className="w-full h-full rounded-t-[30px] md:rounded-md "></div>
                    <div className="absolute right-5 top-5 !z-[1000] md:hidden">
                        <XCircleIcon className="w-10 h-10 text-white m-2 bg-blue-500 rounded-full"
                                     onClick={() => setIsMapOpened(false)}/>
                    </div>
                </div>
                <div onClick={toggleMapOpen}
                     className={`absolute  md:hidden left-10  w-24 h-24 sm:w-36 sm:h-36 rounded-full
                             cursor-pointer  select-none transition-all ease-in-out duration-300 p-1 bg-gray-200 bg-opacity-50 flex items-center justify-center
                              ${isMapOpened ? "-bottom-52 !bg-red-300 " : " bottom-10"}`}>
                    <div className="w-full h-full rounded-full bg-blue-300 flex items-center justify-center ">
                        <MapIcon className="w-24 h-24 text-white m-6 "/>
                    </div>
                </div>
                <div className={`absolute bottom-5  md:left-5 w-full md:w-[20%] p-5 md:p-0 transition-all fade-in ease-in-out duration-500
                            ${isMapOpened ? "block md:block" : " hidden md:block"}`}>
                    <Button
                        className="text-bold text-md text-white w-full"
                        onClick={() => handleDone()}
                        disabled={!markerPos}
                        fullWidth
                        color="blue"
                    >
                        Guess
                    </Button>
                </div>
            </section>
            <Dialog showDialog={isDialogOpen} closeDialog={handleCloseDialog} posPlayer={markerPos} posResult={sVCoords}
                    handleReset={handleReset} score={roundPoints} tries={tries} gameMode={gameMode}/>
            <GameResultDialog showDialog={isGameResultDialogOpen} closeDialog={handleCloseGameResultDialog}/>
        </div>
    );
}

export default Game;
