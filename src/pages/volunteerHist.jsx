import React, { useState, useEffect } from 'react';

const VolunteerHistory = () => {
  const [volunteerHistory, setVolunteerHistory] = useState([]);

  // Simulating fetching volunteer history data
  useEffect(() => {
    const fetchVolunteerHistory = async () => {
      const history = [
        {
          eventName: 'Community Cleanup Drive',
          date: '2024-09-30',
          time: '9:00 AM - 12:00 PM',
          location: 'Main Park',
          participationStatus: 'Completed',
        },
        {
          eventName: 'Food Donation Event',
          date: '2024-08-20',
          time: '2:00 PM - 5:00 PM',
          location: 'City Hall',
          participationStatus: 'No Show',
        },
        {
          eventName: 'Animal Shelter Help',
          date: '2024-07-15',
          time: '10:00 AM - 1:00 PM',
          location: 'Animal Shelter',
          participationStatus: 'Completed',
        },
      ];
      setVolunteerHistory(history);
    };

    fetchVolunteerHistory();
  }, []);

  // Field Validation
  const validateFields = (field) => {
    const { eventName, date, time, location, participationStatus } = field;

    // Check if required fields are present
    if (!eventName || !date || !time || !location || !participationStatus) {
      return false;
    }

    // Validate field types and lengths
    if (eventName.length > 100 || location.length > 100) {
      return false;
    }

    // Validate date format (YYYY-MM-DD)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(date)) {
      return false;
    }

    return true;
  };

  return (
    <div className="container mx-auto p-8 border-4 border-light-blue-500 rounded-lg">
      <div className="bg-black text-white py-4 px-6 mb-8 rounded-lg">
        <h2 className="text-2xl font-bold">Volunteer History</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg border border-blue-300">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left border-b border-blue-300">Event Name</th>
              <th className="py-3 px-6 text-left border-b border-blue-300">Date</th>
              <th className="py-3 px-6 text-left border-b border-blue-300">Time</th>
              <th className="py-3 px-6 text-left border-b border-blue-300">Location</th>
              <th className="py-3 px-6 text-left border-b border-blue-300">Participation Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {volunteerHistory.length > 0 ? (
              volunteerHistory.map((history, index) => (
                validateFields(history) ? (
                  <tr key={index} className="border-b border-blue-300 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left">{history.eventName}</td>
                    <td className="py-3 px-6 text-left">{history.date}</td>
                    <td className="py-3 px-6 text-left">{history.time}</td>
                    <td className="py-3 px-6 text-left">{history.location}</td>
                    <td className="py-3 px-6 text-left">{history.participationStatus}</td>
                  </tr>
                ) : (
                  <tr key={index} className="bg-red-100">
                    <td colSpan="5" className="py-3 px-6 text-center text-red-500">
                      Invalid data for this record
                    </td>
                  </tr>
                )
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-3 px-6 text-center">
                  No volunteer history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolunteerHistory;
