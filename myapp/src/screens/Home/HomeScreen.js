// // /src/screens/Home/HomeScreen.js
// import React from 'react';
// import { View, Text, Button } from 'react-native';

// const HomeScreen = ({ navigation }) => {
//     return (
//         <View>
//             <Text>Home Screen</Text>
            // <Button
            //     title="Go to Login"
            //     onPress={() => navigation.navigate('Login')}
            // />
            
            // <Button
            //     title="Go to Geofencing"
            //     onPress={() => navigation.navigate('GeofencingScreen')}
            // />
//         </View>
//     );
// };


// export default HomeScreen;



// /src/screens/Home/HomeScreen.js
import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

// Correct the import path if necessary
import logo from '../../assets/logo.png'

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Property Surveillance</Text>
            <Text style={styles.subtitle}>Detect and manage intruders on your property.</Text>
            <Text style={styles.description}>
                Our app provides advanced surveillance capabilities to detect unauthorized individuals entering your property. Receive instant notifications and take appropriate action to protect your land and assets.
            </Text>
            <View style={{marginBottom:10,}}>
                <Button
                    title="Get Started"
                    onPress={() => navigation.navigate('Discovery')}
                    color="#841584"
                />
            </View>

            {/* Additional Buttons */}
            {/* <Button
                title="Go to Login"
                onPress={() => navigation.navigate('Login')}
            /> */}
            <Button
                title="Go to Geofencing"
                onPress={() => navigation.navigate('GeofencingScreen') }
                color="#841584"
            />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffff'
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign:'center',
        marginBottom: 10,
        color: '#333'
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: '#666'
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        color: '#777'
    },
    button:{
        padding:10
    }
});
