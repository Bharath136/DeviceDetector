import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { domain } from '../../components/Domain/domain';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
    const fields = [
        { key: 'first_name', placeholder: 'First Name', autoCapitalize: 'words' },
        { key: 'last_name', placeholder: 'Last Name', autoCapitalize: 'words' },
        { key: 'email_address', placeholder: 'Email', keyboardType: 'email-address', autoCapitalize: 'none' },
        { key: 'contact_number', placeholder: 'Mobile', keyboardType: 'phone-pad' },
        { key: 'password', placeholder: 'Password', secureTextEntry: true },
    ];

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});

    const handleInputChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value,
        });
    };

    const handleRegister = async () => {
        if (Object.values(formData).some((value) => !value)) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${domain}/user/register`, formData);

            console.log('Registration successful', response.data);
            navigation.navigate('Login');
        } catch (error) {
            console.error('Registration failed:', error);

            const errorMessage = error.response
                ? error.response.data.message
                : 'Registration failed. Please check your information and try again.';

            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create an Account</Text>
            {fields.map(({ key, placeholder, autoCapitalize, keyboardType, secureTextEntry }) => (
                <TextInput
                    key={key}
                    style={styles.input}
                    placeholder={placeholder}
                    onChangeText={(text) => handleInputChange(key, text)}
                    value={formData[key] || ''}
                    autoCapitalize={autoCapitalize}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                />
            ))}

            <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <Text style={styles.buttonText}>Register</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.linkText}>Already have an account? Login here</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 46,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 2,
    },
    registerButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        width:'100%'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginLink: {
        marginTop: 20,
    },
    linkText: {
        color: '#007bff',
        fontSize: 14,
    },
});

export default RegisterScreen;
