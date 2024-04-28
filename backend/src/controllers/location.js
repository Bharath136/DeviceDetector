const client = require('../database/connection');
// const { sendPassword } = require('./email');

// Function to calculate distance between two points in meters
const distanceBetweenPoints = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters
    return distance;
};

const detectDevice = async (req, res) => {
    const data = req.body;
    const geofenceCenter = { latitude: 13.0548, longitude: 77.7109 };
    const geofenceRadius = 500; // in meters

    const distanceToGeofence = distanceBetweenPoints(
        data.latitude,
        data.longitude,
        geofenceCenter.latitude,
        geofenceCenter.longitude
    );

    const insideGeofence = distanceToGeofence <= geofenceRadius;

    if (insideGeofence) {
        console.log(insideGeofence)
        res.json({ status: 'Device detected inside the geofence', insideGeofence: true });
    } else {
        res.json({ status: 'Device not detected inside the geofence', insideGeofence: false });
    }
};

module.exports = {
    detectDevice
};
