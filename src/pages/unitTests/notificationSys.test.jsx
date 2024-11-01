// NotificationPage.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NotificationPage from '../notifications' ;

describe('NotificationPage', () => {
  test('renders notification messages', () => {
    render(<NotificationPage />);

    // Check for the presence of all notifications
    expect(screen.getByText('Reminder: Community Cleanup Drive on Sep 30, 2024')).toBeInTheDocument();
    expect(screen.getByText('Reminder: Food Donation Event on Aug 20, 2024')).toBeInTheDocument();
    expect(screen.getByText('Reminder: Animal Shelter Help on Jul 15, 2024')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Volunteer Orientation on Oct 5, 2024')).toBeInTheDocument();
    expect(screen.getByText('Don’t forget: Training Workshop on Sep 25, 2024')).toBeInTheDocument();
    expect(screen.getByText('Last call: Charity Run on Oct 1, 2024')).toBeInTheDocument();
  });

  test('dismisses a notification when the dismiss button is clicked', () => {
    render(<NotificationPage />);

    // Find the dismiss button for the first notification
    const dismissButton = screen.getAllByRole('button', { name: /×/ })[0];

    // Click the dismiss button
    fireEvent.click(dismissButton);

    // Check that the first notification is no longer in the document
    expect(screen.queryByText('Reminder: Community Cleanup Drive on Sep 30, 2024')).not.toBeInTheDocument();
  });

  test('displays "No notifications available" when notifications list is empty', () => {
    render(<NotificationPage />);

    // Dismiss all notifications
    const dismissButtons = screen.getAllByRole('button', { name: /×/ });
    dismissButtons.forEach(button => fireEvent.click(button));

    // Check for the no notifications message
    expect(screen.getByText('No notifications available.')).toBeInTheDocument();
  });
});
