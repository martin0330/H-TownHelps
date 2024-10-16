import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/authContext';

const VolunteerMatchingForm = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userProfile } = useAuth();

  // Simulating fetching data from a database
  useEffect(() => {
    const fetchMatches= async () => {
      if (!userProfile) {
        setError("Please complete you profile first");
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
    fetchMatches();  
  }, [userProfile]);

  const handleConfirmMatch = async (matchId) => {
    // Implement the logic to confirm a match
    console.log(`Confirming match for event ${matchId}`);
    // You can make an API call here to update the match status in the backend
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
                <button 
                  onClick={() => handleConfirmMatch(match._id)}
                  className="px-6 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
                >
                  Confirm Match
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