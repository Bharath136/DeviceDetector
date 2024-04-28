import React, { useEffect } from 'react';
import { getUserData } from '../../components/StorageMechanism/storageMechanism';
import { domain } from '../../components/Domain/domain';
import axios from 'axios';

const GeofencingScreen = () => {
    const user = getUserData()
    const userId = user.user_id


    useEffect(() => {
        handleGetUpdate()
    },[])

    const handleGetUpdate = async () => {
        const locationData = {
            latitude: 13.0548,
            longitude: 77.7109,
            userId: user.user_id,
        };
        try {
            const response = await axios.post(`${domain}/location/detect_device`, locationData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            console.log(response)
        }catch(error){
            console.log(error)
        }
    }

    return (
        <div>
            <p>Geofencing Screen</p>
        </div>
    );
};

export default GeofencingScreen;
