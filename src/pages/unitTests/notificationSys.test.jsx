import { render, screen, fireEvent } from '@testing-library/react';
import NotificationPage from '../notification-sys';

describe('NotificationPage component', () => {
  test('renders the notifications list', () => {
    render(<NotificationPage />);

    // Check if notifications are displayed
    expect(screen.getByText('Reminder: Community Cleanup Drive on Sep 30, 2024')).toBeInTheDocument();
    expect(screen.getByText('Reminder: Food Donation Event on Aug 20, 2024')).toBeInTheDocument();
    expect(screen.getByText('Reminder: Animal Shelter Help on Jul 15, 2024')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Volunteer Orientation on Oct 5, 2024')).toBeInTheDocument();
    expect(screen.getByText('Don’t forget: Training Workshop on Sep 25, 2024')).toBeInTheDocument();
    expect(screen.getByText('Last call: Charity Run on Oct 1, 2024')).toBeInTheDocument();
  });

  test('dismisses a notification when the dismiss button is clicked', () => {
    render(<NotificationPage />);

    // Initial check: Ensure the first notification exists
    const firstNotification = screen.getByText('Reminder: Community Cleanup Drive on Sep 30, 2024');
    expect(firstNotification).toBeInTheDocument();

    // Find and click the dismiss button for the first notification
    const dismissButton = screen.getAllByText('×')[0]; // get the first dismiss button
    fireEvent.click(dismissButton);

    // After dismiss, the first notification should be removed
    expect(firstNotification).not.toBeInTheDocument();
  });

  test('displays no notifications available message when all notifications are dismissed', () => {
    render(<NotificationPage />);

    // Dismiss all notifications
    const dismissButtons = screen.getAllByText('×');
    dismissButtons.forEach(button => fireEvent.click(button));

    // Check if the "No notifications available" message is displayed
    expect(screen.getByText('No notifications available.')).toBeInTheDocument();
  });
});
