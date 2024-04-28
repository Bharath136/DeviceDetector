// /src/screens/Home/HomeScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View>
            <Text>Home Screen</Text>
            <Button
                title="Go to Login"
                onPress={() => navigation.navigate('Login')}
            />
            
            <Button
                title="Go to Geofencing"
                onPress={() => navigation.navigate('GeofencingScreen')}
            />
        </View>
    );
};


export default HomeScreen;
