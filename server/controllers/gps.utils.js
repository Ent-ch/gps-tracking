let bearing = (lat1, lng1, lat2, lng2) => {

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

let calculateSpeed = (t1, lat1, lng1, t2, lat2, lng2) => {
    if (typeof(Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function () {
            return this * Math.PI / 180;
        }
    }
    const R = 6371; // km
    let dLat = (lat2 - lat1).toRad(),
        dLon = (lon2 - lon1).toRad();

    lat1 = lat1.toRad();
    lat2 = lat2.toRad();

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) 
        * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2),
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
        distance = R * c;

    return distance / t2 - t1;
}

let compassEarth = (deg) => {
    let floatDeg = parseFloat(deg);

    if (45 < floatDeg && floatDeg >= 315) {
        return 'N';
    }
    if (315 < floatDeg && floatDeg >= 225) {
        return 'E';
    }
    if (225 < floatDeg && floatDeg >= 135) {
        return 'S';
    }
    if (135 < floatDeg && floatDeg >= 45) {
        return 'W';
    }
        
    return false;
}

export {calculateSpeed, bearing, compassEarth};
