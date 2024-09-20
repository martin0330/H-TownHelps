// NotificationPage.jsx
import React, { useState, useEffect } from 'react';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulating fetching notifications with hardcoded data
    const fetchNotifications = () => {
      const notifications = [
        { id: 1, message: 'Reminder: Community Cleanup Drive on Sep 30, 2024', type: 'info' },
        { id: 2, message: 'Reminder: Food Donation Event on Aug 20, 2024', type: 'info' },
        { id: 3, message: 'Reminder: Animal Shelter Help on Jul 15, 2024', type: 'info' },
        { id: 4, message: 'Upcoming Volunteer Orientation on Oct 5, 2024', type: 'info' },
        { id: 5, message: 'Don’t forget: Training Workshop on Sep 25, 2024', type: 'info' },
        { id: 6, message: 'Last call: Charity Run on Oct 1, 2024', type: 'info' },
      ];
      setNotifications(notifications);
    };

    fetchNotifications();
  }, []);

  const handleDismiss = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <div className="container mx-auto p-8 border-4 border-blue-200 rounded-lg">
      {/* Black bar with white text */}
      <div className="bg-black text-white py-4 px-6 mb-8 rounded-lg">
        <h2 className="text-2xl font-bold">Notifications</h2>
      </div>

      {/* Notification List */}
      <div>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 mb-4 rounded-lg shadow-md text-white ${notification.type === 'info' ? 'bg-blue-500' : 'bg-green-500'}`}
            >
              <div className="flex items-center justify-between">
                <span>{notification.message}</span>
                <button
                  onClick={() => handleDismiss(notification.id)}
                  className="ml-4 text-white hover:text-gray-200"
                >
                  &times;
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No notifications available.</div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;

