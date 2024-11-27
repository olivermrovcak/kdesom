export function calculateCenter(lat1: number, lng1: number, lat2: number, lng2: number): { lat: number, lng: number } {
    const centerLat = (lat1 + lat2) / 2;
    const centerLng = (lng1 + lng2) / 2;
    return {lat: centerLat, lng: centerLng};
}