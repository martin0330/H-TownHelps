import React from 'react';
import NotificationPage from "./pages/notification-sys"; // Adjust the path based on your folder structure
import VolunteerMatchingForm from "./pages/volunteer-match"; // Adjust the path based on your folder structure
import VolunteerHistory from "./pages/volunteer-hist"; // Adjust the path based on your folder structure

const App = () => {
  return (
    <div className="container mx-auto p-8">
      {/* Display Volunteer Matching Form */}
      <VolunteerMatchingForm />

      {/* Display Volunteer History */}
      <VolunteerHistory />

      {/* Display Notification Page */}
      <NotificationPage />
    </div>
  );
};

export default App;

