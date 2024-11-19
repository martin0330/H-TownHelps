import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useAuth } from '../components/authContext';

const VolunteerMatchingForm = () => {
    const [error, setError] = useState(null);
    const [events, setEvents] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [adminAccess, setAdminAccess] = useState(false);
    const [selectedPeople, setSelectedPeople] = useState({});
    const { user } = useAuth();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(
                    'http://localhost:5000/api/getEvents',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
                const data = await response.json();

                if (response.ok) {
                    const sortedEvents = data.sort(
                        (a, b) => new Date(a.date) - new Date(b.date)
                    );
                    setEvents(sortedEvents);
                } else {
                    setError(data.error);
                }
            } catch (err) {
                console.error(err);
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
                console.error(err);
            }
        };

        const getAdminAccess = async () => {
            try {
                const response = await fetch(
                    'http://localhost:5000/api/adminAccess',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: user.userEmail }),
                    }
                );
                const data = await response.json();

                if (response.ok) {
                    setAdminAccess(data.access);
                } else {
                    setError(data.error);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchEvents();
        fetchProfiles();
        getAdminAccess();
    }, [user]);

    const getAvailablePeople = (eventDate, eventSkill) => {
        return profiles.filter(
            (profile) =>
                profile.availability.includes(eventDate) &&
                profile.skills.some((skill) => eventSkill.includes(skill))
        );
    };

    const handleSelectChange = (eventId, selectedOptions) => {
        setSelectedPeople((prevState) => ({
            ...prevState,
            [eventId]: selectedOptions
                ? selectedOptions.map((option) => option.value)
                : [],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        for (const [eventId, peopleIds] of Object.entries(selectedPeople)) {
            const event = events.find((e) => e._id === eventId);
            const eventName = event ? event.name : 'Event';

            try {
                for (const personId of peopleIds) {
                    if (!event.volunteers.includes(personId)) {
                        event.volunteers.push(personId);
                    }
                }
                await fetch('http://localhost:5000/api/updateEvent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: eventId,
                        updatedEvent: event,
                    }),
                });
            } catch (error) {
                console.error(error);
            }

            for (const personId of peopleIds) {
                const person = profiles.find(
                    (profile) => profile._id === personId
                );
                if (person) {
                    try {
                        await fetch(
                            'http://localhost:5000/api/sendNotification',
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    email: person.email,
                                    message: `Welcome to the ${eventName} event! We look forward to seeing you there.`,
                                }),
                            }
                        );

                        await fetch('http://localhost:5000/api/sendHistory', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: person.email,
                                message: `Added to ${eventName} event!`,
                            }),
                        });
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        }

        console.log('Participants updated and notifications sent.');
    };

    return (
        <div className='max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg'>
            {error && <p className='text-red-500'>{error}</p>}
            {!adminAccess ? (
                <p className='text-lg text-gray-700'>
                    You do not have access to view the events.
                </p>
            ) : (
                <form onSubmit={handleSubmit}>
                    {events.map((event) => (
                        <div
                            key={event._id}
                            className='mb-6 p-6 border rounded-lg shadow-md bg-gray-100'
                        >
                            <h3 className='text-xl font-bold text-indigo-600'>
                                {event.name}
                            </h3>
                            <p className='text-gray-600'>
                                Date:{' '}
                                {new Date(event.date).toLocaleDateString()}
                            </p>
                            <label
                                htmlFor={`people-dropdown-${event._id}`}
                                className='block mt-3 text-sm font-medium text-gray-700'
                            >
                                Select People:
                            </label>
                            <Select
                                id={`people-dropdown-${event._id}`}
                                isMulti
                                options={getAvailablePeople(
                                    event.date,
                                    event.skills
                                ).map((profile) => ({
                                    value: profile._id,
                                    label: profile.fullName,
                                }))}
                                onChange={(selectedOptions) =>
                                    handleSelectChange(
                                        event._id,
                                        selectedOptions
                                    )
                                }
                                value={
                                    selectedPeople[event._id]?.map(
                                        (personId) => {
                                            const person = profiles.find(
                                                (profile) =>
                                                    profile._id === personId
                                            );
                                            return person
                                                ? {
                                                      value: person._id,
                                                      label: person.fullName,
                                                  }
                                                : null;
                                        }
                                    ) || []
                                }
                                className='mt-1'
                                classNamePrefix='react-select'
                            />
                        </div>
                    ))}
                    <button
                        type='submit'
                        className='mt-6 w-full bg-indigo-600 text-white font-semibold py-2 rounded-md shadow hover:bg-indigo-700 transition duration-200'
                    >
                        Update Participants
                    </button>
                </form>
            )}
        </div>
    );
};

export default VolunteerMatchingForm;
