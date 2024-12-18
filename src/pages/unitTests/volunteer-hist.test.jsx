import React from 'react';
import { render, screen } from '@testing-library/react';
import VolunteerHistory from '../volunteerHist';
import { AuthProvider } from '../../components/authContext';
import '@testing-library/jest-dom';

const mockUser  = {
  userEmail: 'test@example.com',
};

describe('VolunteerHistory Component', () => {
  beforeEach(() => {
    // Mock the useAuth hook
    jest.spyOn(require('../../components/authContext'), 'useAuth').mockReturnValue({ user: mockUser  });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders volunteer history heading', () => {
    render(<AuthProvider><VolunteerHistory /></AuthProvider>);
    const headings = screen.getAllByText(/Volunteer History/i);
    expect(headings.length).toBeGreaterThan(0); // Check that at least one exists
    expect(headings[0]).toBeInTheDocument(); // Optionally check the first one
});
  
});