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
        const response = await fetch('http://localhost:5000/api/getEvents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();

        if (response.ok) {
          const sortedEvents = data.sort((a, b) => new Date(a.date) - new Date(b.date));
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
        const response = await fetch('http://localhost:5000/api/getProfiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
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
        const response = await fetch('http://localhost:5000/api/adminAccess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.userEmail }),
        });
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

  // Function to get available people for a specific event date
  const getAvailablePeople = (eventDate) => {
    return profiles.filter(profile => profile.availability.includes(eventDate));
  };

  // Handle change in dropdown selection (now multi-select)
  const handleSelectChange = (eventId, selectedOptions) => {
    setSelectedPeople((prevState) => ({
      ...prevState,
      [eventId]: selectedOptions ? selectedOptions.map(option => option.value) : [],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("updating events", selectedPeople);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      {error && <p className="text-red-500">{error}</p>}
      {!adminAccess ? (
        <p className="text-lg text-gray-700">You do not have access to view the events.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {events.map(event => (
            <div key={event.id} className="mb-6 p-6 border rounded-lg shadow-md bg-gray-100">
              <h3 className="text-xl font-bold text-indigo-600">{event.name}</h3>
              <p className="text-gray-600">Date: {new Date(event.date).toLocaleDateString()}</p>
              <label htmlFor={`people-dropdown-${event.id}`} className="block mt-3 text-sm font-medium text-gray-700">Select People:</label>
              <Select
                id={`people-dropdown-${event.id}`}
                isMulti
                options={getAvailablePeople(event.date).map(profile => ({
                  value: profile.id,
                  label: profile.name,
                }))}
                onChange={(selectedOptions) => handleSelectChange(event.id, selectedOptions)}
                value={selectedPeople[event.id]?.map(personId => {
                  const person = profiles.find(profile => profile.id === personId);
                  return person ? { value: person.id, label: person.name } : null;
                })}
                className="mt-1"
                classNamePrefix="react-select"
              />
            </div>
          ))}
          <button
            type="submit"
            className="mt-6 w-full bg-indigo-600 text-white font-semibold py-2 rounded-md shadow hover:bg-indigo-700 transition duration-200"
          >
            Update Participants
          </button>
        </form>
      )}
    </div>
  );
};

export default VolunteerMatchingForm;
