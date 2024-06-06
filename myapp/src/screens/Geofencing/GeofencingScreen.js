import React, { useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import axios from 'axios';

let Geolocation;
let PermissionsAndroid;

if (Platform.OS !== 'web') {
    Geolocation = require('react-native-geolocation-service');
    PermissionsAndroid = require('react-native').PermissionsAndroid;
}

const GeofencingScreen = () => {
    const [location, setLocation] = useState({});
    const [city, setCity] = useState("");

    useEffect(() => {
        if (Platform.OS !== 'web') {
            requestLocationPermission();
        } else {
            // For web, use mock location or skip location logic
            const mockLocation = { latitude: 13.0548, longitude: 77.7109 };
            setLocation(mockLocation);
            fetchCityName(mockLocation.latitude, mockLocation.longitude);
        }
    }, []);

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app needs access to your location.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getCurrentLocation();
            } else {
                console.log('Location permission denied');
            }
        } else {
            getCurrentLocation();
        }
    };

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                fetchCityName(latitude, longitude);
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const fetchCityName = async (latitude, longitude) => {
        try {
            const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
                params: {
                    key: 'AIzaSyDhZkDrcAYmHHY6KN-B5sgjNTro7QOoi0c',
                    q: `${latitude}+${longitude}`,
                    pretty: 1,
                },
            });
            if (response.data && response.data.results && response.data.results[0]) {
                const components = response.data.results[0].components;
                const city = components.city || components.town || components.village || components.state || '';
                console.log(city)
                setCity(city);
            }
        } catch (error) {
            console.error('Error fetching city name:', error);
        }
    };

    return (
        <View>
            <Text>Geofencing Screen</Text>
            {location.latitude && location.longitude && (
                <Text>
                    Current Location: Latitude: {location.latitude}, Longitude: {location.longitude}
                </Text>
            )}
            {city && <Text>City: {city}</Text>}
        </View>
    );
};

export default GeofencingScreen;
