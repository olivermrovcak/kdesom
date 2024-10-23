import React, {useEffect, useRef, useState} from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { calculateCenter } from "../utils/utils";

interface Props {
    closeDialog: () => void,
    showDialog?: boolean,
    posPlayer: any,
    posResult: any
    handleReset: () => void
}

let map: google.maps.Map;

export default function DialogDefault({showDialog, closeDialog, posPlayer, posResult, handleReset}: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(showDialog ?? false);
    const mapRef = useRef<HTMLDivElement | null>(null);

    function handleClose(event: object, reason: string) {
        if (reason && reason === "backdropClick" && "escapeKeyDown") {
            return;
        }
        setIsOpen(false);
        closeDialog();
    }

    function initMap(): void {
            const mapOptions: google.maps.MapOptions = {
                center: {lat: 48.77559816437337, lng: 19.61552985351171},
                zoom: 9,
                mapTypeControl: false,
                zoomControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                draggable: false,
                scrollwheel: false,
                disableDoubleClickZoom: true,
            };
            map = new google.maps.Map(mapRef.current as HTMLElement, mapOptions);

        const stViewLat: any = posResult?.lat() ;
        const stViewLng: number = posResult?.lng();

        const markerLat: number = posPlayer?.lat();
        const markerLng: number = posPlayer?.lng();
            
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

        polyline.setMap(map);
        map.setCenter(calculateCenter(stViewLat, stViewLng, markerLat, markerLng));
    }

    useEffect(() => {
        if (isOpen && mapRef.current) {
            initMap();
        }
    }, [isOpen]);

    useEffect(() => {
        setIsOpen(showDialog ?? false);
    }, [showDialog]);

    return (
            <Dialog open={isOpen} onClose={handleClose} size="xl" fullWidth maxWidth={false}  disableEscapeKeyDown>
                <DialogHeader>Result</DialogHeader>
                <DialogBody>
                    <div ref={mapRef} className="w-full h-[400px] rounded-lg">
                        s
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button onClick={handleReset}>Next</Button>
                </DialogFooter>
            </Dialog>
    );
}
