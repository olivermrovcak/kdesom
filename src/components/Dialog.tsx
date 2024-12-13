import React, {useEffect, useRef, useState} from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Progress,
} from "@material-tailwind/react";
import {calculateCenter} from "../utils/utils";
import {GamemodeEnum} from "../utils/GamemodeEnum";
import guessLogo from '../images/guess-logo.png';


interface Props {
    closeDialog: () => void,
    showDialog?: boolean,
    posPlayer: any,
    posResult: any
    handleReset: () => void,
    score: number,
    tries: number,
    gameMode: GamemodeEnum
}

let map: google.maps.Map;

export default function DialogDefault({
                                          showDialog,
                                          closeDialog,
                                          posPlayer,
                                          posResult,
                                          handleReset,
                                          score,
                                          tries,
                                          gameMode
                                      }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(showDialog ?? false);
    const [progress, setProgress] = useState<number>(0);
    const mapRef = useRef<HTMLDivElement | null>(null);
    const triesNum = tries;

    function handleClose(event: object, reason: string) {
        if (reason && reason === "backdropClick" && "escapeKeyDown") {
            return;
        }
        closeDialog();
        setIsOpen(false);
    }

    function getStartingZoom() {
        if (gameMode === GamemodeEnum.SVK_EASY || gameMode === GamemodeEnum.SVK_HARD) {
            return 7;
        } else {
            return 4;
        }
    }

    function getZoomByGameMode() {
        switch (gameMode) {
            case GamemodeEnum.SVK_EASY:
            case GamemodeEnum.SVK_HARD:
                return 13;
            default:
                return 9;
        }
    }

    const [val, setVal] = useState(0);
    const MIN = 0;
    const MAX = 5000;
    const normalise = (value: number) => ((value - MIN) * 100) / (MAX - MIN);

    function initMap(): void {
        const mapOptions: google.maps.MapOptions = {
            center: {lat: 48.77559816437337, lng: 19.61552985351171},
            zoom: getStartingZoom(),
            mapTypeControl: false,
            zoomControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            draggable: true,
            scrollwheel: true,
            disableDoubleClickZoom: true,
            styles: [

                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{visibility: "off"}]
                },
            ]
        };
        map = new google.maps.Map(mapRef.current as HTMLElement, mapOptions);

        const stViewLat: any = posResult?.lat();
        const stViewLng: number = posResult?.lng();

        const markerLat: number = posPlayer?.lat();
        const markerLng: number = posPlayer?.lng();

        const coordinates = [
            {lat: markerLat, lng: markerLng},
            {lat: stViewLat, lng: stViewLng},
        ];

        const polyline = new google.maps.Polyline({
            path: coordinates,
            strokeColor: "#ff0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });

        const pinSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4285F4">
        <path d="M480-600q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm0-80q25 0 42.5-17.5T540-740q0-25-17.5-42.5T480-800q-25 0-42.5 17.5T420-740q0 25 17.5 42.5T480-680Zm0 600L240-320q-20-20-30-45t-10-55q0-59 40.5-99.5T340-560q29 0 53.5 11t44.5 31l42 42 42-42q20-20 44.5-31t53.5-11q59 0 99.5 40.5T760-420q0 30-10 55t-30 45L480-80Zm0-114 182-182q9-9 13.5-20.5T680-420q0-24-17-42t-43-18q-12 0-21.5 3.5T580-464L480-364 380-464q-6-6-15.5-11t-24.5-5q-26 0-43 18t-17 42q0 12 5 22.5t13 19.5l182 184Zm0-546Zm0 403Z"/>
      </svg>`;

        const markerIcon = {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(pinSvg),
            scaledSize: new google.maps.Size(40, 40),
        };

        const playerMarker = new google.maps.Marker({
            map: map,
            icon: markerIcon,
            title: "Custom SVG Marker",
        });

        const resultMarker = new google.maps.Marker({
            map: map,
        });

        playerMarker.setPosition({lat: markerLat, lng: markerLng});
        resultMarker.setPosition({lat: stViewLat, lng: stViewLng});

        polyline.setMap(map);
        map.setCenter(calculateCenter(stViewLat, stViewLng, markerLat, markerLng));

        setTimeout(() => {
            map.panTo({lat: stViewLat, lng: stViewLng});
            smoothZoom(getZoomByGameMode(), map.getZoom());
        }, 1500);
    }

    function smoothZoom(targetZoom: number, currentZoom: any) {
        if (currentZoom >= targetZoom) return; // Stop when reaching the target zoom level

        map.setZoom(currentZoom);
        setTimeout(() => {
            smoothZoom(targetZoom, currentZoom + 1); // Increase zoom level gradually
        }, 100); // Adjust the delay for smoother or faster zoom transition
    }


    useEffect(() => {
        if (isOpen) {
            initMap();
            const interval = setInterval(() => {
                setProgress((prevVal) => {
                    if (prevVal >= score) {
                        clearInterval(interval);
                        return prevVal;
                    }
                    return prevVal + 1;
                });
            }, 10);

            return () => clearInterval(interval);
        }
        return () => {
            setProgress(0)
        };
    }, [isOpen]);

    useEffect(() => {
        setIsOpen(showDialog ?? false);
    }, [showDialog]);

    return (
        <>
            {isOpen && (
                <div
                    className="App w-screen h-screen absolute top-0 left-0 !overflow-hidden !z-[9999]">
                    <div className="relative w-full h-full !overflow-hidden">
                        <div className="logo absolute left-[50%] top-5 -translate-x-[50%] sm:-translate-x-[0%] sm:left-5  lg:top-5 lg:left-5 w-[30%] sm:w-[15%] !z-[1000]">
                            <img src={guessLogo} alt="logo"/>
                        </div>
                        <div ref={mapRef} className="!absolute top-0 left-0 w-full h-full rounded-lg"></div>
                        <div className=" w-full md:w-[50%] p-5 h-[30%] bottom-0 absolute">
                            <div className="w-full h-full rounded-lg bg-blue-700 bg-opacity-40 backdrop-blur-lg flex flex-col justify-end items-center p-3">
                                <div className="w-[50%] p-3 h-[50%] text-center text-black font-black text-2xl ">
                                    {score} / 5000
                                </div>
                                <div className="p-1 bg-blue-700 bg-opacity-30 w-fit rounded-lg ">
                                    <Button onClick={handleReset} className="text-2xl bg-blue-600 hover:shadow-none shadow-none font-black rounded-md ">
                                        Další pokus
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
