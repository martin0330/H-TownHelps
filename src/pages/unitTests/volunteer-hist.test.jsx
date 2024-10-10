import React from 'react';
import { render, screen } from '@testing-library/react';
import VolunteerHistory from '../volunteer-hist'; // Adjust the import based on your file structure

// Mocking the console.log for tests
global.console = {
  log: jest.fn(),
};

describe('VolunteerHistory Component', () => {
  beforeEach(() => {
    render(<VolunteerHistory />);
  });

  test('renders Volunteer History title', () => {
    const titleElement = screen.getByText(/volunteer history/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('displays volunteer history data correctly', async () => {
    const rows = await screen.findAllByRole('row');
    expect(rows).toHaveLength(4); // 3 data rows + 1 header row

    expect(screen.getByText('Community Cleanup Drive')).toBeInTheDocument();
    expect(screen.getByText('2024-09-30')).toBeInTheDocument();
    expect(screen.getByText('9:00 AM - 12:00 PM')).toBeInTheDocument();
    expect(screen.getByText('Main Park')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    
    expect(screen.getByText('Food Donation Event')).toBeInTheDocument();
    expect(screen.getByText('2024-08-20')).toBeInTheDocument();
    expect(screen.getByText('2:00 PM - 5:00 PM')).toBeInTheDocument();
    expect(screen.getByText('City Hall')).toBeInTheDocument();
    expect(screen.getByText('No Show')).toBeInTheDocument();

    expect(screen.getByText('Animal Shelter Help')).toBeInTheDocument();
    expect(screen.getByText('2024-07-15')).toBeInTheDocument();
    expect(screen.getByText('10:00 AM - 1:00 PM')).toBeInTheDocument();
    expect(screen.getByText('Animal Shelter')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  test('displays invalid data message for bad records', async () => {
    // Temporarily modify the fetch logic in the component to simulate invalid data
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [[
      { eventName: '', date: '', time: '', location: '', participationStatus: '' }
    ], jest.fn()]);

    render(<VolunteerHistory />);

    expect(screen.getByText('Invalid data for this record')).toBeInTheDocument();
  });

  test('displays no volunteer history message when data is empty', () => {
    // Temporarily mock the data fetch to return an empty array
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [[], jest.fn()]);

    render(<VolunteerHistory />);

    expect(screen.getByText('No volunteer history available.')).toBeInTheDocument();
  });
});
