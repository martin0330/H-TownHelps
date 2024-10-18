import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/authContext';

const VolunteerMatchingForm = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // New state for available volunteers
  const [availableVolunteers, setAvailableVolunteers] = useState([]);
  // New state for the selected volunteer
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const { userProfile } = useAuth();

  useEffect(() => {
    const fetchMatches = async () => {
      if (!userProfile) {
        setError("Please complete your profile first");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/api/volunteer-matching', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userProfile),
        });

        if(!response.ok){
          throw new Error('Failed to fetch matches');
        }

        const data = await response.json();
        setMatches(data);
        setLoading(false);
      } catch(error) {
        console.error('Error fetching matches:', error);
        setError('Failed to fetch matches. Please try again later.');
        setLoading(false);
      }
    };

    // New function to fetch available volunteers
    const fetchAvailableVolunteers = async () => {
      try {
        // Make a GET request to fetch available volunteers
        const response = await fetch('http://localhost:5000/api/available-volunteers');
        if (!response.ok) {
          throw new Error('Failed to fetch available volunteers');
        }
        const data = await response.json();
        // Set the fetched volunteers to the state
        setAvailableVolunteers(data);
      } catch (error) {
        console.error('Error fetching available volunteers:', error);
      }
    };

    fetchMatches();
    // Call the new function to fetch available volunteers
    fetchAvailableVolunteers();
  }, [userProfile]);

  // Updated function to handle sending an event to a selected volunteer
  const handleConfirmMatch = async (matchId) => {
    // Check if a volunteer has been selected
    if (!selectedVolunteer) {
      alert('Please select a volunteer first');
      return;
    }
    try {
      // Make a POST request to send the event to the selected volunteer
      const response = await fetch('http://localhost:5000/api/send-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matchId, volunteerId: selectedVolunteer }),
      });

      if (!response.ok) {
        throw new Error('Failed to send event');
      }

      // Alert the user of success and reset the selected volunteer
      alert('Event sent successfully to the volunteer!');
      setSelectedVolunteer(null);
    } catch (error) {
      console.error('Error sending event:', error);
      alert('Failed to send event. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading matches...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="bg-black p-4 mb-4">
        <h2 className="text-2xl font-bold text-white">Volunteer Matching Results</h2>
      </div>

      {matches.length === 0 ? (
        <div className="text-center mt-8">No matching opportunities found.</div>
      ) : (
        matches.map((match, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-6 mb-6 flex">
            <div className="w-2/3 pr-6">
              <h3 className="text-xl font-semibold mb-2">{match.title}</h3>
              <div className="mb-4">
                <p><strong>Skills Required:</strong> {match.requiredSkills.join(', ')}</p>
                <p><strong>Date & Time:</strong> {new Date(match.dateTime).toLocaleString()}</p>
                <p><strong>Location:</strong> {match.location}</p>
              </div>
              <div className="bg-gray-50 border rounded-md p-4 mt-4">
                <h4 className="text-lg font-semibold mb-2">Event Details</h4>
                <p>{match.description}</p>
              </div>
              <div className="mt-6">
                {/* New dropdown for selecting a volunteer */}
                <div className="relative inline-block text-left mb-4">
                  <select
                    value={selectedVolunteer}
                    onChange={(e) => setSelectedVolunteer(e.target.value)}
                    className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Select a volunteer</option>
                    {/* Map through available volunteers to create options */}
                    {availableVolunteers.map((volunteer) => (
                      <option key={volunteer.id} value={volunteer.id}>
                        {volunteer.name}
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                {/* Updated button text and onClick handler */}
                <button 
                  onClick={() => handleConfirmMatch(match._id)}
                  className="px-6 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
                >
                  Send Event to Volunteer
                </button>
              </div>
            </div>
            <div className="w-1/3">
              <img
                src={match.imageUrl || "https://via.placeholder.com/300x200.png?text=Event+Image"}
                alt={match.title}
                className="rounded-lg shadow-md w-full h-auto object-cover"
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default VolunteerMatchingForm;