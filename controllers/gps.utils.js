export function bearing(lat1, lng1, lat2, lng2) {

    let dLon = toRad(lng2 - lng1);

    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    let y = Math.sin(dLon) * Math.cos(lat2),
        x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon),
        rad = Math.atan2(y, x),
        brng = toDeg(rad);

    return (brng + 360) % 360;
}

function toRad(deg) {
    return deg * Math.PI / 180;
}

function toDeg(rad) {
    return rad * 180 / Math.PI;
}

