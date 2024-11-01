import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/authContext';

const VolunteerHistory = () => {
    const [volunteerHistory, setVolunteerHistory] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Fetch volunteer history data from API
    useEffect(() => {
        const fetchVolunteerHistory = async () => {
            try {
                const response = await fetch(
                    'http://localhost:5000/api/getHistory',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: user.userEmail }),
                    }
                );
                const data = await response.json();

                if (response.ok) {
                    setVolunteerHistory(data);
                } else {
                    setError(data.error);
                }
            } catch (err) {
                console.error('Error fetching volunteer history:', err);
                setError('Server error occurred. Please try again later.');
            }
        };

        fetchVolunteerHistory();
    }, [user]);

    // Field Validation
    const validateFields = (field) => {
        const { eventName, date, time, location, participationStatus } = field;

        if (!eventName || !date || !time || !location || !participationStatus)
            return false;
        if (eventName.length > 100 || location.length > 100) return false;

        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        return datePattern.test(date);
    };

    return (
        <div className='container mx-auto p-8 border-4 border-light-blue-500 rounded-lg'>
            <div className='bg-black text-white py-4 px-6 mb-8 rounded-lg'>
                <h2 className='text-2xl font-bold'>Volunteer History</h2>
            </div>

            {error ? (
                <p className='text-red-500 text-center'>{error}</p>
            ) : (
                <div className='overflow-x-auto'>
                    <table className='min-w-full bg-white shadow-md rounded-lg border border-blue-300'>
                        <thead>
                            <tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
                                <th className='py-3 px-6 text-left border-b border-blue-300'>
                                    Event Name
                                </th>
                                <th className='py-3 px-6 text-left border-b border-blue-300'>
                                    Date
                                </th>
                                <th className='py-3 px-6 text-left border-b border-blue-300'>
                                    Time
                                </th>
                                <th className='py-3 px-6 text-left border-b border-blue-300'>
                                    Location
                                </th>
                                <th className='py-3 px-6 text-left border-b border-blue-300'>
                                    Participation Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-700 text-sm'>
                            {volunteerHistory.length > 0 ? (
                                volunteerHistory.map((history, index) =>
                                    validateFields(history) ? (
                                        <tr
                                            key={index}
                                            className='border-b border-blue-300 hover:bg-gray-100'
                                        >
                                            <td className='py-3 px-6 text-left'>
                                                {history.eventName}
                                            </td>
                                            <td className='py-3 px-6 text-left'>
                                                {history.date}
                                            </td>
                                            <td className='py-3 px-6 text-left'>
                                                {history.time}
                                            </td>
                                            <td className='py-3 px-6 text-left'>
                                                {history.location}
                                            </td>
                                            <td className='py-3 px-6 text-left'>
                                                {history.participationStatus}
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={index} className='bg-red-100'>
                                            <td
                                                colSpan='5'
                                                className='py-3 px-6 text-center text-red-500'
                                            >
                                                Invalid data for this record
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan='5'
                                        className='py-3 px-6 text-center'
                                    >
                                        No volunteer history available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default VolunteerHistory;
