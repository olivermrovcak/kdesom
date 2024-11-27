import React from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export default function Map() {
    return (
        <div className="rounded-md w-[20%] h-[20%] hover:w-[60%] hover:h-[45%] transition-all ease-in-out duration-300 bg-blue-200 bottom-10 left-10 absolute ">
            <MapContainer className="w-full h-full" center={[48.8739, 20.5851]} zoom={6} scrollWheelZoom={false}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[48.8739, 20.5851]}>
                    <Popup>
                        Rudňany, Slovakia
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
