import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // For table support in PDF
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
  const getAvailablePeople = (eventDate, eventSkill) => {
    return profiles.filter((profile) =>
        profile.availability.includes(eventDate) &&
        profile.skills.some((skill) => eventSkill.includes(skill))
    );
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

  // Generate Report Function
  const generateReport = (format) => {
    if (!events || !Array.isArray(events) || events.length === 0) {
      alert('No events to generate a report for.');
      return;
    }
  
    if (format === 'pdf') {
      const doc = new jsPDF();
  
      // Title
      doc.text("Volunteer Activities Report", 10, 10);
  
      let yPosition = 20; // Initial Y position for the content
  
      // Iterate through events and create sections
      events.forEach((event, index) => {
        const eventName = event.name || "Unnamed Event"; // Fallback for event name
        const eventDate = event.date
          ? new Date(event.date).toLocaleDateString()
          : "No Date Provided"; // Fallback for date
        const assignedVolunteers = (selectedPeople[event.id] || [])
          .map((id) => profiles.find((profile) => profile.id === id)?.fullName || "Unknown Volunteer")
          .filter(Boolean); // Ensure no invalid entries
  
        // Event details
        doc.text(`${index + 1}. Event: ${eventName}`, 10, yPosition);
        yPosition += 10;
        doc.text(`Date: ${eventDate}`, 10, yPosition);
        yPosition += 10;
  
        // Add table for volunteers
        doc.autoTable({
          startY: yPosition,
          head: [['Volunteer Name']],
          body: assignedVolunteers.length > 0
            ? assignedVolunteers.map((name) => [name])
            : [['No volunteers assigned']],
          theme: 'striped', // Optional styling
        });
  
        // Update yPosition based on the table's final position
        yPosition = doc.lastAutoTable.finalY + 10;
      });
  
      // Save PDF
      doc.save('volunteer_report.pdf');
  
    } else if (format === 'csv') {
      const rows = [];
  
      // Build CSV rows
      events.forEach((event) => {
        const eventName = event.name || "Unnamed Event";
        const eventDate = event.date
          ? new Date(event.date).toLocaleDateString()
          : "No Date Provided";
        const assignedVolunteers = (selectedPeople[event.id] || [])
          .map((id) => profiles.find((profile) => profile.id === id)?.fullName || "Unknown Volunteer")
          .filter(Boolean);
  
        rows.push([eventName, eventDate, assignedVolunteers.join(', ') || 'None']);
      });
  
      // Construct CSV content
      const csvContent = [
        ['Event Name', 'Event Date', 'Volunteers'], // Header row
        ...rows,
      ]
        .map((row) => row.map((cell) => `"${cell}"`).join(',')) // Escape commas and wrap in quotes
        .join('\n');
  
      // Create and download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'volunteer_report.csv';
      link.click();
    } else {
      alert('Invalid format specified. Please select PDF or CSV.');
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg relative">
      {error && <p className="text-red-500">{error}</p>}
      <div className="absolute top-2 right-2 flex space-x-2">
        <button
          onClick={() => generateReport('pdf')}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Generate PDF
        </button>
        <button
          onClick={() => generateReport('csv')}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          Generate CSV
        </button>
      </div>
      {!adminAccess ? (
        <p className="text-lg text-gray-700">You do not have access to view the events.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {events.map((event) => (
            <div key={event.id} className="mb-6 p-6 border rounded-lg shadow-md bg-gray-100">
              <h3 className="text-xl font-bold text-indigo-600">{event.name}</h3>
              <p className="text-gray-600">Date: {new Date(event.date).toLocaleDateString()}</p>
              <label htmlFor={`people-dropdown-${event.id}`} className="block mt-3 text-sm font-medium text-gray-700">Select People:</label>
              <Select
                id={`people-dropdown-${event.id}`}
                isMulti
                options={getAvailablePeople(event.date, event.skills).map(
                    (profile) => ({
                        value: profile.id,
                        label: `${profile.fullName}: ${profile.email}`,
                    })
                )}
                onChange={(selectedOptions) => handleSelectChange(event.id, selectedOptions)}
                value={selectedPeople[event.id]?.map((personId) => {
                  const person = profiles.find((profile) => profile.id === personId);
                  return person ? { value: person.id, label: person.fullName } : null;
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
