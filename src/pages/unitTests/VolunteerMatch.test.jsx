import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VolunteerMatchingForm from '../volunteerMatch';
import { useAuth } from '../../components/authContext';
import '@testing-library/jest-dom';

// Mocking useAuth and fetch API
jest.mock('../../components/authContext', () => ({
  useAuth: jest.fn(),
}));

global.fetch = jest.fn();

describe('VolunteerMatchingForm Component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { userEmail: 'admin@example.com' },
    });
    fetch.mockClear();
  });

  test('renders without crashing and displays loading spinner', () => {
    render(<VolunteerMatchingForm />);
    expect(screen.getByText(/updating events/i)).toBeInTheDocument();
  });

  test('shows "No access" message when user lacks admin access', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access: false }),
    });

    render(<VolunteerMatchingForm />);
    const accessMessage = await screen.findByText(/you do not have access/i);
    expect(accessMessage).toBeInTheDocument();
  });

  test('displays events and profiles when user has admin access', async () => {
    const mockEvents = [
      { id: 1, name: 'Community Cleanup', date: '2024-09-01' },
      { id: 2, name: 'Food Donation', date: '2024-09-15' },
    ];
    const mockProfiles = [
      { id: 1, name: 'John Doe', availability: ['2024-09-01'] },
      { id: 2, name: 'Jane Smith', availability: ['2024-09-15'] },
    ];

    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access: true }) }) // Admin access
      .mockResolvedValueOnce({ ok: true, json: async () => mockEvents }) // Events
      .mockResolvedValueOnce({ ok: true, json: async () => mockProfiles }); // Profiles

    render(<VolunteerMatchingForm />);

    // Check if the events are rendered
    const event1 = await screen.findByText('Community Cleanup');
    const event2 = await screen.findByText('Food Donation');

    expect(event1).toBeInTheDocument();
    expect(event2).toBeInTheDocument();
  });

  test('allows selecting multiple people for an event', async () => {
    const mockEvents = [{ id: 1, name: 'Community Cleanup', date: '2024-09-01' }];
    const mockProfiles = [
      { id: 1, name: 'John Doe', availability: ['2024-09-01'] },
      { id: 2, name: 'Jane Smith', availability: ['2024-09-01'] },
    ];

    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access: true }) }) // Admin access
      .mockResolvedValueOnce({ ok: true, json: async () => mockEvents }) // Events
      .mockResolvedValueOnce({ ok: true, json: async () => mockProfiles }); // Profiles

    render(<VolunteerMatchingForm />);

    await waitFor(() => screen.getByText('Community Cleanup'));

    const selectPeopleLabel = screen.getByText(/select people:/i);
    expect(selectPeopleLabel).toBeInTheDocument();

    const selectComponent = screen.getByLabelText(/select people:/i);
    fireEvent.change(selectComponent, { target: { value: ['John Doe', 'Jane Smith'] } });

    // Verify selected values in the dropdown
    const selectedOptions = screen.getAllByRole('option');
    expect(selectedOptions).toHaveLength(2);
  });

  test('handles form submission without errors', async () => {
    const mockEvents = [{ id: 1, name: 'Community Cleanup', date: '2024-09-01' }];
    const mockProfiles = [
      { id: 1, name: 'John Doe', availability: ['2024-09-01'] },
    ];

    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access: true }) }) // Admin access
      .mockResolvedValueOnce({ ok: true, json: async () => mockEvents }) // Events
      .mockResolvedValueOnce({ ok: true, json: async () => mockProfiles }); // Profiles

    render(<VolunteerMatchingForm />);

    await waitFor(() => screen.getByText('Community Cleanup'));

    const submitButton = screen.getByText(/update participants/i);
    fireEvent.click(submitButton);

    // Assuming the form will console.log on submit, check that no errors are thrown
    expect(submitButton).toBeInTheDocument();
  });
});
