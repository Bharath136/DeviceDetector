import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { domain } from '../../components/Domain/domain';
import axios from 'axios';
import { getToken, setToken, setUserData } from '../../components/StorageMechanism/storageMechanism';

const LoginScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = getToken();

    const fields = [
        { key: 'email_address', placeholder: 'Email', keyboardType: 'email-address', autoCapitalize: 'none' },
        { key: 'password', placeholder: 'Password', secureTextEntry: true },
    ];

    const [formData, setFormData] = useState(
        fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {})
    );

    useEffect(() => {
        if (token) {
            navigation.navigate('Home');
        }
    }, [token]);

    const handleInputChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value,
        });
    };

    const handleLogin = async () => {
        if (Object.values(formData).some((value) => !value)) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${domain}/user/login`, formData);
            setUserData(response.data.user);
            setToken(response.data.token);
            navigation.navigate('Home');
        } catch (error) {
            const errorMessage = error.response
                ? error.response.data.message
                : 'Login failed. Please check your credentials and try again.';

            setError(errorMessage);
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>

            {fields.map(({ key, placeholder, keyboardType, autoCapitalize, secureTextEntry }) => (
                <TextInput
                    key={key}
                    style={styles.input}
                    placeholder={placeholder}
                    onChangeText={(text) => handleInputChange(key, text)}
                    value={formData[key]}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    secureTextEntry={secureTextEntry}
                />
            ))}

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Do not have an account? Register here</Text>
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
    loginButton: {
        width: '100%',
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    loginLink: {
        marginTop: 20,
    },
    linkText: {
        color: '#007bff',
        fontSize: 14,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
});

export default LoginScreen;
