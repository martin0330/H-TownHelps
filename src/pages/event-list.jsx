import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/authContext';
import { Link } from 'react-router-dom';

const EventList = () => {
    const { user } = useAuth(); // Assuming user.UserEmail is available here
    const [adminAccess, setAdminAccess] = useState(false); // Track admin access state
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch the events from the backend
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/getEvents', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await response.json();

                if (response.ok) {
                    setEvents(data); // Set the events data
                } else {
                    setError(data.error); // Handle the error response
                }
            } catch (err) {
                console.error(err);
            }
        };

        // Check if the user has admin access
        const getAdminAccess = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/adminAccess', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.userEmail }),
                });
                const data = await response.json();

                if (response.ok) {
                    setAdminAccess(data.access); // Set admin access
                } else {
                    setError(data.error); // Handle the error response
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchEvents();
        getAdminAccess();
    }, [user.userEmail]);

    // Delete event function
    const handleDelete = async (eventId) => {
        try {
            console.log(`event id: ${eventId}`)
            const response = await fetch('http://localhost:5000/api/deleteEvent', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId })
            });

            if (response.ok) {
                // Remove the deleted event from the events array
                setEvents(events.filter((event) => event._id !== eventId));
            } else {
                const errorData = await response.json();
                setError(errorData.error);
            }
        } catch (err) {
            console.error('Failed to delete event:', err);
            setError('Failed to delete event.');
        }
    };

    return (
        <div className='min-h-screen bg-gray-100 py-10'>
            <div className='max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg'>
                <h1 className='text-3xl font-bold text-center text-gray-800 mb-6'>
                    Event List
                </h1>
                {error && (
                    <p className='text-red-500 text-center mb-4'>{error}</p>
                )}
                {adminAccess && (
                    <div className="text-center mb-6">
                        <Link to='/eventmanage'>
                            <button className='bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300'>
                                Add Event
                            </button>
                        </Link>
                    </div>
                )}
                {events.length > 0 ? (
                    <ul className='space-y-6'>
                        {events.map((event) => (
                            <li
                                key={event._id}
                                className='p-4 border border-gray-200 rounded-lg shadow hover:shadow-lg transition duration-300'
                            >
                                <h3 className='text-xl font-semibold text-gray-700'>
                                    {event.name}
                                </h3>
                                <p className='text-gray-600 mt-2'>
                                    {event.description}
                                </p>
                                <p className='text-gray-500 mt-2'>
                                    Date:{' '}
                                    {new Date(event.date).toLocaleDateString()}
                                </p>
                                <p className='text-gray-500 mt-2'>
                                    Skills: {event.skills.join(', ')}
                                </p>
                                <p className='text-gray-500 mt-2'>
                                    People: {event.people.join(', ')}
                                </p>

                                {/* Conditionally render delete button if adminAccess is true */}
                                {adminAccess && (
                                    <button
                                        className='mt-4 bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                                        onClick={() => handleDelete(event._id)}
                                    >
                                        Delete Event
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className='text-center text-gray-600'>
                        No events available
                    </p>
                )}
            </div>
        </div>
    );
};

export default EventList;
