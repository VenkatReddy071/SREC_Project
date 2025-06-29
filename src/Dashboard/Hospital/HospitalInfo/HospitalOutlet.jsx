import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HospitalOutletInfoPanel } from './HospitalOutletInfoPanel';

const HospitalOutletInfoSection = () => {
    const [hospital, setHospital] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

    const fetchHospitalInfo = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('dashboard');
        if (!token) {
            console.error('No authentication token found.');
            setIsLoading(false);
            return;
        }

        try {
            const config = {
                headers: { 'Authorization': `Bearer ${token}` },
                withCredentials: true,
            };
            const response = await axios.get(`${API_BASE_URL}/api/hospitals/profile/email`, config);
            setHospital(response.data?.mall);
        } catch (error) {
            console.error('Error fetching hospital outlet info:', error.response?.data || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHospitalInfo();
    }, []);

    const handleUpdateHospital = (updatedHospital) => {
        setHospital(updatedHospital);
    };

    return (
        <div className="flex-grow flex flex-col p-4 bg-gray-50 font-inter">
            {isLoading ? (
                <div className="flex-grow flex items-center justify-center bg-white p-6 m-4 rounded-lg shadow-md min-h-[400px]">
                    <p className="text-gray-500 text-xl font-medium">Loading hospital outlet information...</p>
                </div>
            ) : (
                <HospitalOutletInfoPanel
                    hospital={hospital}
                    onUpdate={handleUpdateHospital}
                    onRefresh={fetchHospitalInfo}
                />
            )}
        </div>
    );
};

export default HospitalOutletInfoSection;