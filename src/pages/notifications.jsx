import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/authContext';
import { MdClose } from "react-icons/md";

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [sendNotifScreen, setSendNotifScreen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState('');
    const [message, setMessage] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(
                    'http://localhost:5000/api/getNotifications',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: user.userEmail }),
                    }
                );
                const data = await response.json();

                if (response.ok) {
                    setNotifications(data.notificationList);
                } else {
                    setError(data.error);
                }
            } catch (err) {
                setError('Failed to fetch notifications.');
            }
        };

        const fetchProfiles = async () => {
            try {
                const response = await fetch(
                    'http://localhost:5000/api/getProfiles',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    setProfiles(data);
                } else {
                    setError(data.error);
                }
            } catch (err) {
                setError('Failed to fetch profiles.');
            }
        };

        fetchNotifications();
        fetchProfiles();
    }, [user.userEmail, sendNotifScreen]);

    const handleDismiss = async (notificationText) => {
        try {
            const updatedNotifications = notifications.filter((notif) => notif !== notificationText);
            setNotifications(updatedNotifications);

            await fetch('http://localhost:5000/api/updateNotifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.userEmail,
                    notificationList: updatedNotifications,
                }),
            });
            setSuccess('Notification dismissed successfully.');
        } catch (err) {
            setError('Error dismissing notification.');
        }
    };

    const handleSendNotification = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/sendNotification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: selectedEmail,
                    message: message,
                }),
            });
            const data = await response.json();

            if (response.ok) {
                setSelectedEmail('');
                setMessage('');
                setSendNotifScreen(false);
                setSuccess('Notification sent successfully.');
            } else {
                setError('Failed to send notification: ' + data.error);
            }
        } catch (err) {
            setError('An error occurred while sending the notification.');
        }
    };

    // Automatically clear messages after a timeout
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError('');
                setSuccess('');
            }, 3000); // Clear after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    return (
        <div className='h-full'>
            {sendNotifScreen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
                        <button
                            onClick={() => {
                                setSendNotifScreen(false);
                                setSelectedEmail('');
                                setMessage('');
                            }}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                        >
                            <MdClose />
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-center">Send Notification</h2>
                        <form onSubmit={handleSendNotification}>
                            <div className="mb-4">
                                <label className="block font-semibold mb-2" htmlFor="email">
                                    Email:
                                </label>
                                <select
                                    id="email"
                                    value={selectedEmail}
                                    onChange={(e) => setSelectedEmail(e.target.value)}
                                    className="p-2 border rounded w-full"
                                    required
                                >
                                    <option value='' disabled>Select an email</option>
                                    {profiles.map((profile) => (
                                        <option key={profile.id} value={profile.email}>
                                            {profile.email}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block font-semibold mb-2" htmlFor="message">
                                    Message:
                                </label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="p-2 border rounded w-full"
                                    rows={4}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                            >
                                Send Notification
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <div className="container mx-auto p-8 border-4 border-blue-200 rounded-lg relative h-auto">
                <div className="bg-black text-white py-4 px-6 mb-8 rounded-lg flex justify-between">
                    <h2 className="text-2xl font-bold">Notifications</h2>
                    <button
                        onClick={() => setSendNotifScreen(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        New Notification
                    </button>
                </div>

                {/* Error and Success Messages */}
                {error && (
                    <div className="bg-red-500 text-white font-bold p-4 mb-4 rounded-lg text-xl flex justify-center items-center">
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="bg-green-500 text-white font-bold p-4 mb-4 rounded-lg text-xl flex justify-center items-center">
                        <span>{success}</span>
                    </div>
                )}

                {/* Notifications List */}
                <div>
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <div
                                key={index}
                                className="p-4 mb-4 rounded-lg shadow-md text-white bg-blue-500"
                            >
                                <div className="flex items-center justify-between">
                                    <span>{notification}</span>
                                    <button
                                        onClick={() => handleDismiss(notification)}
                                        className="ml-4 text-white hover:text-gray-200"
                                    >
                                        <MdClose />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">
                            No notifications available.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationPage;
