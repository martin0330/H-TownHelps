import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/authContext';
import { Link, useNavigate } from 'react-router-dom';

const EventList = () => {
    const { user } = useAuth(); // Assuming user.UserEmail is available here
    const [adminAccess, setAdminAccess] = useState(false); // Track admin access state
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // To programmatically navigate

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
                    // Sort events by date (earliest to latest)
                    const sortedEvents = data.sort((a, b) => new Date(a.date) - new Date(b.date));
                    setEvents(sortedEvents); // Set the sorted events
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
            console.log(`event id: ${eventId}`);
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

    // Navigate to the edit event form
    const handleEdit = async (eventId) => {
        // try {
        //     console.log(`event id: ${eventId}`);
        //     const response = await fetch('http://localhost:5000/api/deleteEvent', {
        //         method: 'DELETE',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ eventId })
        //     });

        //     if (response.ok) {
        //         // Remove the deleted event from the events array
        //         setEvents(events.filter((event) => event._id !== eventId));
        //     } else {
        //         const errorData = await response.json();
        //         setError(errorData.error);
        //     }
        // } catch (err) {
        //     console.error('Failed to delete event:', err);
        //     setError('Failed to delete event.');
        // }
    };

    return (
        <div className='min-h-screen bg-blue-100 py-10'>
            <div className='max-w-4xl mx-auto p-6 bg-white shadow-md rounded-2xl md:mt-10'>
                <h1 className='text-3xl font-bold text-center text-gray-800 mb-6'>
                    Event List
                </h1>
                {error && (
                    <p className='text-red-500 text-center mb-4'>{error}</p>
                )}
                {adminAccess && (
                    <div className="text-center mb-6">
                        <Link to='/eventmanage'>
                            <button className='bg-blue-600 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300'>
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
                                className='p-4 border border-gray-200 rounded-lg shadow hover:shadow-lg hover:scale-[102%] transition duration-300'
                            >
                                <h3 className='text-xl font-semibold text-gray-700'>
                                    {event.name}
                                </h3>
                                <p className='text-gray-600 mt-2'>
                                    {event.description}
                                </p>
                                <p className='text-gray-500 mt-2'>
                                    Date: {new Date(event.date).toLocaleDateString()}
                                </p>
                                <p className='text-gray-500 mt-2'>
                                    Skills: {event.skills.join(', ')}
                                </p>
                                <p className='text-gray-500 mt-2'>
                                    People: {event.people.join(', ')}
                                </p>

                                {/* Conditionally render admin buttons */}
                                {adminAccess && (
                                    <div className="flex space-x-4 mt-4">
                                        <button
                                            className='bg-red-600 hover:bg-red-800 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline duration-300'
                                            onClick={() => handleDelete(event._id)}
                                        >
                                            Delete Event
                                        </button>
                                        <button
                                            className='bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline duration-300'
                                            onClick={() => handleEdit(event._id)}
                                        >
                                            Edit Event
                                        </button>
                                    </div>
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
