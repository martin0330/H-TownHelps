import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useAuth } from '../components/authContext';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import Papa from 'papaparse';

const VolunteerMatchingForm = () => {
    const [error, setError] = useState(null);
    const [events, setEvents] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [adminAccess, setAdminAccess] = useState(false);
    const [selectedPeople, setSelectedPeople] = useState({});
    const [volunteerHistory, setVolunteerHistory] = useState([]);
    const [updatedDiv, setUpdatedDiv] = useState(false);
    const navigate = useNavigate();
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

                    // Initialize selectedPeople state
                    const initialSelectedPeople = {};
                    sortedEvents.forEach((event) => {
                        initialSelectedPeople[event._id] =
                            event.volunteers || [];
                    });
                    setSelectedPeople(initialSelectedPeople);
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

            for (const personId of peopleIds) {
                const person = profiles.find(
                    (profile) => profile._id === personId
                );
                if (person) {
                    try {
                        if (event.volunteers.includes(personId)) continue;
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
                                historyItem: {
                                    date: new Date(
                                        event.date
                                    ).toLocaleDateString(),
                                    description: `Added to ${eventName} event!`,
                                },
                            }),
                        });
                    } catch (error) {
                        console.error(error);
                    }
                }
            }

            try {
                event.volunteers = peopleIds;
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
        }

        console.log('Participants updated and notifications sent.');
        setUpdatedDiv(true);
        setTimeout(() => {
            setUpdatedDiv(false);
            navigate('/main');
        }, 2000);
    };

    const fetchVolunteerHistory = async () => {
        try {
            const response = await fetch(
                'http://localhost:5000/api/getHistory',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: profiles }),
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

    const generatePDFReport = () => {
        const doc = new jsPDF();

        // Add the header
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Volunteer Participation Report', 105, 20, {
            align: 'center',
        });

        // Add a horizontal line under the header
        doc.setLineWidth(0.5);
        doc.line(10, 25, 200, 25);

        // Add Event Details Section
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Event Details', 10, 35);

        let yOffset = 45; // Start below the section header
        events.forEach((event) => {
            const volunteers = event.volunteers
                ?.map((personId) => {
                    const person = profiles.find(
                        (profile) => profile._id === personId
                    );
                    return person ? person.fullName : 'Unknown';
                })
                .join(', ');

            // Event details
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(`Event Name: ${event.name}`, 10, yOffset);
            doc.text(
                `Date: ${new Date(event.date).toLocaleDateString()}`,
                10,
                yOffset + 5
            );
            doc.text(`Volunteers: ${volunteers || 'None'}`, 10, yOffset + 10);

            // Add spacing between events
            yOffset += 20;
        });

        // Add a horizontal line to separate sections
        doc.line(10, yOffset - 5, 200, yOffset - 5);

        // Add Volunteer History Section
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Volunteer History', 10, yOffset + 5);

        yOffset += 15;

        volunteerHistory.forEach((volunteer) => {
            const { email, histories } = volunteer;

            // Email Header
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(`Email: ${email}`, 10, yOffset);

            // Volunteer History Details
            yOffset += 5;
            histories.forEach((historyItem) => {
                const description = historyItem.description || '';
                const date =
                    new Date(historyItem.date).toLocaleDateString() || '';
                const status =
                    new Date(historyItem.date) < new Date()
                        ? 'Completed'
                        : 'Ongoing';

                doc.setFontSize(12);
                doc.setFont('helvetica', 'normal');
                doc.text(`  Description: ${description}`, 10, yOffset + 5);
                doc.text(`  Date: ${date}`, 10, yOffset + 10);
                doc.text(`  Status: ${status}`, 10, yOffset + 15);

                yOffset += 20;
            });

            // Add spacing between different volunteers
            yOffset += 10;
        });

        // Save the PDF
        doc.save('styled_volunteer_participation_report.pdf');
    };

    const generateCSVReport = () => {
        // Define the CSV header
        let csvContent = 'Event Name,Event Date,Number of Volunteers\n';

        // Add Event Details
        events.forEach((event) => {
            const eventName = event.name || '';
            const eventDate = new Date(event.date).toLocaleDateString() || '';
            const numberOfVolunteers = event.volunteers?.length || 0;

            csvContent += `${eventName},${eventDate},${numberOfVolunteers}\n`;
        });

        // Add a Section for Volunteer History
        csvContent += '\nVolunteer History\n';
        csvContent += 'Email,Description,Date,Status\n';

        // Iterate through volunteer history
        fetchVolunteerHistory();
        volunteerHistory.forEach((volunteer) => {
            const { email, histories } = volunteer;

            histories.forEach((historyItem) => {
                const description = historyItem.description || '';
                const date =
                    new Date(historyItem.date).toLocaleDateString() || '';
                const status =
                    new Date(historyItem.date) < new Date()
                        ? 'Completed'
                        : 'Ongoing';

                // Append email and history details
                csvContent += `${email},${description},${date},${status}\n`;
            });
        });

        // Trigger download
        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'volunteer_participation_report.csv';
        link.click();
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
                    <div className='flex justify-between mb-6'>
                        <h3 className='text-xl font-bold text-indigo-600'>
                            Volunteer Matching
                        </h3>
                        <div className='flex space-x-4'>
                            <button
                                type='button'
                                onClick={generatePDFReport}
                                className='bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-green-700'
                            >
                                Generate PDF Report
                            </button>
                            <button
                                type='button'
                                onClick={generateCSVReport}
                                className='bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-blue-700'
                            >
                                Generate CSV Report
                            </button>
                        </div>
                    </div>

                    {events.map((event) => (
                        <div
                            key={event._id}
                            className='mb-6 p-6 border rounded-lg shadow-md bg-gray-100'
                        >
                            <h3 className='text-xl font-semibold text-gray-700'>
                                {event.name}
                            </h3>
                            <p className='text-gray-600 mt-2'>
                                {event.description}
                            </p>
                            <p className='text-gray-500 mt-2'>
                                Location: {event.location}
                            </p>
                            <p className='text-gray-500 mt-2'>
                                Date:{' '}
                                {new Date(event.date).toLocaleDateString()}
                            </p>
                            <p className='text-gray-500 mt-2'>
                                Skills: {event.skills.join(', ')}
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
                                    (selectedPeople[event._id] || [])
                                        .map((personId) => {
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
                                        })
                                        .filter(Boolean) // Remove any null values
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
                    {updatedDiv && (
                        <div className='text-xl text-green-500 font-bold flex items-center justify-center'>
                            Updated Events. Going back to home page now...
                        </div>
                    )}
                </form>
            )}
        </div>
    );
};

export default VolunteerMatchingForm;
