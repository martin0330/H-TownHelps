import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/authContext';

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(
                    'http://localhost:5000/api/getNotifications',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: user.userEmail }), // Convert body to JSON string
                    }
                );
                const data = await response.json();

                if (response.ok) {
                    // Sort notifications by date (earliest to latest)
                    const sortedNotifications = data.sort(
                        (a, b) => new Date(a.date) - new Date(b.date)
                    );
                    setNotifications(sortedNotifications); // Set the sorted notifications
                } else {
                    setError(data.error); // Handle the error response
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchNotifications();
    }, []);

    const handleDismiss = (id) => {
        setNotifications(
            notifications.filter((notification) => notification.id !== id)
        );
    };

    return (
        <div className='container mx-auto p-8 border-4 border-blue-200 rounded-lg'>
            <div className='bg-black text-white py-4 px-6 mb-8 rounded-lg'>
                <h2 className='text-2xl font-bold'>Notifications</h2>
            </div>

            <div>
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 mb-4 rounded-lg shadow-md text-white ${
                                notification.type === 'info'
                                    ? 'bg-blue-500'
                                    : 'bg-green-500'
                            }`}
                        >
                            <div className='flex items-center justify-between'>
                                <span>{notification.message}</span>
                                <button
                                    onClick={() =>
                                        handleDismiss(notification.id)
                                    }
                                    className='ml-4 text-white hover:text-gray-200'
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-center text-gray-500'>
                        No notifications available.
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPage;
