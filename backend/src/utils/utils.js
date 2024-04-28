// utils/utils.js
const { sin, cos, sqrt, atan2 } = Math;

function radians(degrees) {
    return degrees * (Math.PI / 180);
}

function distanceBetweenPoints(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers

    const dlat = radians(lat2 - lat1);
    const dlon = radians(lon2 - lon1);

    const a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2;
    const c = 2 * atan2(sqrt(a), sqrt(1 - a));

    const distance = R * c;
    return distance;
}

module.exports = { radians, distanceBetweenPoints };
