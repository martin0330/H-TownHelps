import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/authContext';

const VolunteerMatchingForm = () => {
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [adminAccess, setAdminAccess] = useState(false); // Track admin access
  const [selectedPeople, setSelectedPeople] = useState({}); // Store selected profiles for each event
  const { user } = useAuth();

  useEffect(() => {
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

    const fetchProfiles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/getProfiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok) {
          setProfiles(data);
        } else {
          setError(data.error); // Handle the error response
        }
      } catch (err) {
        console.error(err);
      }
    };

    const getAdminAccess = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/adminAccess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.userEmail }),
        });
        const data = await response.json();

        if (response.ok) {
          setAdminAccess(data.access); // Update admin access state
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

  // Function to get available people for a specific event date
  const getAvailablePeople = (eventDate) => {
    return profiles.filter(profile => 
      profile.availability.includes(eventDate)
    );
  };

  // Handle change in dropdown selection
  const handleSelectChange = (eventId, profileId) => {
    setSelectedPeople((prevState) => ({
      ...prevState,
      [eventId]: profileId,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // try {
    //   const response = await fetch('http://localhost:5000/api/updateEventParticipants', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(selectedPeople),
    //   });

    //   const data = await response.json();
    //   if (response.ok) {
    //     alert("Participants updated successfully!");
    //     // Optionally refetch events or handle UI updates here
    //   } else {
    //     setError(data.error);
    //   }
    // } catch (err) {
    //   console.error(err);
    // }

    // Simulate a backend call to update the events in the database
    console.log("updating events");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {error && <p className="text-red-500">{error}</p>}
      {!adminAccess ? (
        <p className="text-lg text-gray-700">You do not have access to view the events.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {events.map(event => (
            <div key={event.id} className="mb-4 p-4 border rounded-lg shadow-md bg-gray-50">
              <h3 className="text-xl font-semibold">{event.name}</h3>
              <p className="text-gray-600">Date: {new Date(event.date).toLocaleDateString()}</p>
              <label htmlFor={`people-dropdown-${event.id}`} className="block mt-2 text-sm font-medium text-gray-700">Select People:</label>
              <select
                id={`people-dropdown-${event.id}`}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
                onChange={(e) => handleSelectChange(event.id, e.target.value)}
                defaultValue={selectedPeople[event.id] || ""}
              >
                <option value="">-- Select a person --</option>
                {getAvailablePeople(event.date).map(profile => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button type="submit" className="mt-4 w-full bg-indigo-600 text-white font-semibold py-2 rounded-md shadow hover:bg-indigo-700 transition duration-200">
            Update Participants
          </button>
        </form>
      )}
    </div>
  );
};

export default VolunteerMatchingForm;