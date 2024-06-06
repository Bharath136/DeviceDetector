const express = require('express');
require('./database/connection');
const bodyParser = require('body-parser');
const { createClient } = require('@google/maps');
const cors = require('cors');

const cron = require('node-cron');
// const { checkGeofence } = require('./controllers/location');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Apply CORS middleware globally
app.use(bodyParser.json()); // Parse JSON bodies


// Schedule the checkLocations function to run every 4 hours
// cron.schedule('0 */4 * * *', checkGeofence);

// Mount the user router
const userRouter = require('./routes/user');
app.use('/user', userRouter);

// const GOOGLEMAP_API_KEY = 'AIzaSyCVV6XZ56Pp-o2_m2Ibzhp9CHxtQ8tP__c'

const GOOGLEMAP_API_KEY = "AIzaSyAJmWuFOm_URhj6fbQ8QGcu98NryGMfJG4"

// Create a Google Maps client with your API key
const googleMapsClient = createClient({
    key: GOOGLEMAP_API_KEY
});








// Function to check if a location is inside the geofence
function checkGeofence(geofence) {
    return new Promise((resolve, reject) => {
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

// Endpoint to handle geofence check
app.get('/geofence', (req, res) => {
    // Example geofence data
    const geofence = {
        lat: 37.7749, // Latitude of the geofence center
        lng: -122.4194, // Longitude of the geofence center
        radius: 5000 // Radius of the geofence in meters
    };

    checkGeofence(geofence)
        .then(isInside => {
            if (isInside) {
                res.json({
                    message: 'ALERT: Unauthorized device detected within the secured area.',
                    action: 'Please take immediate action to investigate and secure the perimeter.'
                });
            } else {
                res.json({
                    message: 'No unauthorized devices detected within the secured area.',
                    action: 'Continue monitoring the area for any unusual activity.'
                });
            }
        })

        .catch(err => {
            console.error('Error:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});























// Endpoint to handle geofencing
// app.get('/geofence', (req, res) => {
//     // const { latitude, longitude, radius } = req.body;
//     const latitude = 13.0548
//     const longitude = 77.7109
//     const radius = 5

//     // Define the geofence
//     const geofence = {
//         lat: latitude,
//         lng: longitude,
//         radius: radius
//     };

//     // Check if the device is inside the geofence
//     googleMapsClient.geofencing({
//         locations: [{ lat: latitude, lng: longitude }],
//         fences: [{ lat: geofence.lat, lng: geofence.lng, radius: geofence.radius }]
//     }, (err, response) => {
//         if (!err) {
//             const results = response.json.results;
//             if (results.length > 0 && results[0].fenceDetails[0].isInside) {
//                 // Device is inside the geofence
//                 res.json({ message: 'Device is inside the geofence. Take action...' });
//             } else {
//                 // Device is outside the geofence
//                 res.json({ message: 'Device is outside the geofence.' });
//             }
//         } else {
//             console.error('Error:', err);
//             res.status(500).json({ error: 'Internal server error' });
//         }
//     });
// });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
