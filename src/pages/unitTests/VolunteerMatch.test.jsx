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


  test('shows "No access" message when user lacks admin access', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access: false }),
    });

    render(<VolunteerMatchingForm />);
    const accessMessage = await screen.findByText(/you do not have access/i);
    expect(accessMessage).toBeInTheDocument();
  });

  
});
