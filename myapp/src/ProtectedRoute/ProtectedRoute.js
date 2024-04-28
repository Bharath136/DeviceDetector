// ProtectedRoute.js
import React from 'react';
import { Route, useNavigation } from '@react-navigation/native';

import { getToken } from '../components/StorageMechanism/storageMechanism';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const token = getToken()
    const navigation = useNavigation

    // Check token existence and expiration
    const isAuthenticated = token && token !== 'undefined';

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? <Component {...props} /> : (() => {
                    navigation.navigate('Login');
                    return null; 
                })()
            }
        />
    );
};

export default ProtectedRoute;
