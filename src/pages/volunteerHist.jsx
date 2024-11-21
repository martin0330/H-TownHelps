import mongoose from 'mongoose';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/authContext';

const validateFields = (historyItem) => {
    // Validate historyItem which is an objects with date and description
    // Should already be validated if added to the DB, just check if they are there
    const { date, description } = historyItem;
    if (date && description) return true;

    return false;
};

const VolunteerHistory = () => {
    const [volunteerHistory, setVolunteerHistory] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useAuth();

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
                    // setError(data.error);
                }
            } catch (err) {
                console.error('Error fetching volunteer history:', err);
                setError('Server error occurred. Please try again later.');
            }
        };

        fetchVolunteerHistory();
    }, [user]);

    return (
        <div className='container mx-auto p-8 border-4 border-light-blue-500 rounded-lg'>
            <div className='bg-black text-white py-4 px-6 mb-8 rounded-lg'>
                <h2 className='text-2xl font-bold'>Volunteer History</h2>
            </div>

            {error ? (
                <p className='text-red-500 text-center'>{error}</p>
            ) : volunteerHistory.length === 0 ? (
                <p className='text-gray-500 text-center'>
                    No volunteer history available.
                </p>
            ) : (
                <div className='overflow-x-auto'>
                    <table className='min-w-full bg-white shadow-md rounded-lg border border-blue-300'>
                        <thead>
                            <tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
                                <th className='py-3 px-6 text-left border-b border-blue-300'>
                                    Description
                                </th>
                                <th className='py-3 px-6 text-left border-b border-blue-300'>
                                    Participation Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-700 text-sm'>
                            {volunteerHistory.map((history, index) =>
                                validateFields(history) ? (
                                    <tr
                                        key={index}
                                        className='border-b border-blue-300 hover:bg-gray-100'
                                    >
                                        <td className='py-3 px-6 text-left'>
                                            <div className='mb-2'>
                                                {history.description}
                                            </div>
                                        </td>
                                        <td className='py-3 px-6 text-left'>
                                            {history.date <
                                            new Date().toISOString()
                                                ? 'Completed'
                                                : 'Ongoing'}
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={index} className='bg-red-100'>
                                        <td
                                            colSpan='3'
                                            className='py-3 px-6 text-center text-red-500'
                                        >
                                            Invalid data for this record
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default VolunteerHistory;
