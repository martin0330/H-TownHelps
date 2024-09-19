import React, { useState, useEffect } from 'react';

const VolunteerMatchingForm = () => {
  const [volunteerName, setVolunteerName] = useState('');
  const [matchedEvent, setMatchedEvent] = useState('');
  const [eventDetails, setEventDetails] = useState(null);

  // Simulating fetching data from a database
  useEffect(() => {
    const fetchVolunteerData = async () => {
      const volunteer = {
        name: 'John Doe',
        matchedEvent: 'Community Cleanup Drive',
        eventDetails: {
          skillsRequired: 'Teamwork, Physical Stamina',
          date: 'Sep 30, 2024',
          time: '9:00 AM - 12:00 PM',
          location: 'Main Park',
        }
      };
      setVolunteerName(volunteer.name);
      setMatchedEvent(volunteer.matchedEvent);
      setEventDetails(volunteer.eventDetails);
    };

    fetchVolunteerData();
  }, []);

  return (
    <div className="container mx-auto p-8">
      {/* Black bar at the top with white title */}
      <div className="bg-black p-4 mb-4">
        <h2 className="text-2xl font-bold text-white">Volunteer Matching Form</h2>
      </div>

      {/* Flex container to hold the form on the left and image on the right */}
      <div className="flex flex-row">
        {/* Form on the left */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="volunteerName">
              Volunteer Name:
            </label>
            <input
              type="text"
              id="volunteerName"
              value={volunteerName}
              disabled
              className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="matchedEvent">
              Matched Event:
            </label>
            <input
              type="text"
              id="matchedEvent"
              value={matchedEvent}
              disabled
              className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {eventDetails && (
            <div className="bg-gray-50 border rounded-md p-4 mt-4">
              <h3 className="text-lg font-semibold mb-2">Event Details</h3>
              <p><strong>Skills Required:</strong> {eventDetails.skillsRequired}</p>
              <p><strong>Date & Time:</strong> {eventDetails.date} - {eventDetails.time}</p>
              <p><strong>Location:</strong> {eventDetails.location}</p>
            </div>
          )}
          
          <div className="mt-6">
            <button className="px-6 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">
              Confirm Match
            </button>
          </div>
        </div>

        {/* Image on the right */}
        <div className="ml-8">
          <img
            src="https://media.istockphoto.com/id/1351442130/photo/multiracial-volunteers-planting-in-public-park.jpg?s=612x612&w=0&k=20&c=AaM1yRn6w6XZ_R78osWzHptRvMAKK5lmNuJACb6opic=" // Replace with the actual image URL
            alt="Volunteer Event"
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default VolunteerMatchingForm;
