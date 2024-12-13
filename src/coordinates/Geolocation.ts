import { StreetViewService } from "google.maps";
import { villages } from "../coordinates/villages";
import { countries } from "../coordinates/Countries";

const RADIUS = 50000;

export class PanoramaService {
    private geocoder: google.maps.Geocoder;
    private streetViewService: google.maps.StreetViewService;

    constructor(geocoder: google.maps.Geocoder, streetViewService: google.maps.StreetViewService) {
        this.geocoder = geocoder;
        this.streetViewService = streetViewService;
    }

    private getRandomCountry(): string {
        const randomIndex = Math.floor(Math.random() * countries.length);
        return countries[randomIndex];
    }

    public getRandomVillage(): string {
        const randomIndex = Math.floor(Math.random() * villages.length);
        return villages[randomIndex];
    }

    private getLocationByDescription(description: string): Promise<google.maps.LatLng | google.maps.LatLngLiteral> {
        return new Promise((resolve, reject) => {
            this.geocoder.geocode({ address: description }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results[0]) {
                    resolve(results[0].geometry.location);
                } else {
                    console.error("Geocoding failed: " + status);
                    reject(status);
                }
            });
        });
    }

    private getCountryBoundsByDescription(description: string): Promise<google.maps.LatLngBounds> {
        return new Promise((resolve, reject) => {
            this.geocoder.geocode({ address: description }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results[0]) {
                    resolve(results[0].geometry.bounds as google.maps.LatLngBounds);
                } else {
                    console.error("Geocoding of country bounds failed: " + status);
                    reject(status);
                }
            });
        });
    }

    private getStreetViewRequest(location: google.maps.LatLng): google.maps.StreetViewLocationRequest {
        return {
            location,
            source: google.maps.StreetViewSource.OUTDOOR,
            radius: RADIUS,
        };
    }

    private randomPlaceInBounds(bounds: google.maps.LatLngBounds): google.maps.LatLng {
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        const lat = Math.random() * (ne.lat() - sw.lat()) + sw.lat();
        const lng = Math.random() * (ne.lng() - sw.lng()) + sw.lng();
        return new google.maps.LatLng(lat, lng);
    }

    public async getSvkVillagePanorama(callBack?: (data: any, village: string) => void): Promise<string | null> {
        const village = this.getRandomVillage();
        const location = await this.getLocationByDescription(village);
        const streetViewRequest = this.getStreetViewRequest(location);

        return new Promise((resolve, reject) => {
            this.streetViewService.getPanorama(streetViewRequest, (data, status) => {
                if (status === google.maps.StreetViewStatus.OK && data) {
                    if (callBack) callBack(data, village);
                    resolve(data.location.pano);
                } else {
                    console.error("No Street View data available for this location.");
                    resolve(this.getSvkVillagePanorama(callBack));
                    reject("No Street View data available.");
                }
            });
        });
    }

    public async getCountryPanorama(callBack?: (data: any, country: string) => void,country?: string): Promise<string | null> {
        if (!country) country = this.getRandomCountry();
        console.log("Getting panorama for country: " + country)
        const bounds = await this.getCountryBoundsByDescription(country);
        const randomLocation = this.randomPlaceInBounds(bounds);
        const streetViewRequest = this.getStreetViewRequest(randomLocation);

        return new Promise((resolve, reject) => {
            this.streetViewService.getPanorama(streetViewRequest, (data, status) => {
                if (status === google.maps.StreetViewStatus.OK && data) {
                    if (callBack) callBack(data, country);
                    resolve(data.location.pano);
                } else {
                    console.error("No Street View data available for this location. Trying again...");
                    resolve(this.getCountryPanorama(callBack));
                    reject("No Street View data available.");
                }
            });
        });
    }
}
