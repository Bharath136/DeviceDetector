const client = require('../database/connection'); // Adjust the path as necessary


// Function to check if a location is inside the geofence
function checkGeofence(geofence) {
    return new Promise((resolve, reject) => {
        // Assuming the geofence is defined as { lat, lng, radius }
        googleMapsClient.distanceMatrix({
            origins: [{ lat: geofence.lat, lng: geofence.lng }],
            destinations: [{ lat: geofence.lat, lng: geofence.lng }],
            mode: 'walking' // Use walking mode for geofence check
        }, (err, response) => {
            if (err) {
                reject(err);
            } else {
                const distance = response.json.rows[0].elements[0].distance.value;
                if (distance <= geofence.radius) {
                    resolve(true); // Location is inside the geofence
                } else {
                    resolve(false); // Location is outside the geofence
                }
            }
        });
    });
}

// Example usage
const geofence = {
    lat: 37.7749, // Latitude of the geofence center
    lng: -122.4194, // Longitude of the geofence center
    radius: 5000 // Radius of the geofence in meters
};

checkGeofence(geofence)
    .then(isInside => {
        if (isInside) {
            console.log('Some device is inside the geofence. Take action...');
            // Trigger alert or notification for unknown device entry
        } else {
            console.log('No unknown devices detected inside the geofence.');
        }
    })
    .catch(err => {
        console.error('Error:', err);
    });

module.exports = {
    checkGeofence
};
