import React from 'react';
import { render, screen } from '@testing-library/react';
import VolunteerHistory from '../volunteerHist';

describe('VolunteerHistory Component', () => {
  test('renders volunteer history heading', () => {
    render(<VolunteerHistory />);
    const heading = screen.getByText(/Volunteer History/i);
    expect(heading).toBeInTheDocument();
  });

  test('displays volunteer history data correctly', async () => {
    render(<VolunteerHistory />);
    
    const eventName = await screen.findByText('Community Cleanup Drive');
    const date = await screen.findByText('2024-09-30');
    const time = await screen.findByText('9:00 AM - 12:00 PM');
    const location = await screen.findByText('Main Park');
    const status = await screen.findByText('Completed');
    
    expect(eventName).toBeInTheDocument();
    expect(date).toBeInTheDocument();
    expect(time).toBeInTheDocument();
    expect(location).toBeInTheDocument();
    expect(status).toBeInTheDocument();
  });

  test('displays "No volunteer history available" when history is empty', async () => {
    render(<VolunteerHistory />);

    const noHistoryMessage = await screen.findByText('No volunteer history available.');
    expect(noHistoryMessage).toBeInTheDocument();
  });

  test('renders error for invalid data entry', async () => {
    const mockInvalidData = [
      {
        eventName: 'Invalid Event Name',
        date: 'invalid-date',
        time: '1:00 PM - 4:00 PM',
        location: 'Test Location',
        participationStatus: 'Completed',
      },
    ];

    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockInvalidData),
    });

    render(<VolunteerHistory />);

    const errorMessage = await screen.findByText('Invalid data for this record');
    expect(errorMessage).toBeInTheDocument();

    global.fetch.mockRestore();
  });
});
