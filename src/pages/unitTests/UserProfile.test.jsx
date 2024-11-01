import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfile from '../userProfile';
import { useAuth } from '../../components/authContext';
import fetchMock from 'jest-fetch-mock';

jest.mock('../../components/authContext', () => ({
  useAuth: jest.fn(),
}));

beforeEach(() => {
  fetchMock.resetMocks();
  useAuth.mockReturnValue({ user: { userEmail: 'test@example.com' } });
});

describe('UserProfile Component', () => {
  
  test('renders the form fields', () => {
    render(<UserProfile />);

    // Check if input fields are in the document
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address 1/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Zip Code/i)).toBeInTheDocument();
  });

  test('displays an error if required fields are empty on submit', async () => {
    render(<UserProfile />);

    const submitButton = screen.getByText(/Save Profile/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  test('fetches and autofills user data', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({
      fullName: 'John Doe',
      address1: '123 Main St',
      address2: '',
      city: 'Test City',
      zipCode: '12345',
      state: 'CA',
      skills: ['IT Infrastructure & Software', 'Engineering'],
      availability: ['2024-11-01', '2024-11-10']
    }));

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test City')).toBeInTheDocument();
      expect(screen.getByDisplayValue('12345')).toBeInTheDocument();
    });
  });

  test('submits data successfully', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'Profile saved successfully!' }));

    render(<UserProfile />);

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Address 1/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByLabelText(/Zip Code/i), { target: { value: '12345' } });

    // Select a state
    fireEvent.change(screen.getByLabelText(/State/i), { target: { value: 'CA' } });

    // Select Skills
    fireEvent.change(screen.getByLabelText(/Skills/i), { target: { value: 'IT Infrastructure & Software' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Save Profile/i));

    await waitFor(() => {
      expect(screen.getByText('Profile saved successfully!')).toBeInTheDocument();
    });
  });

  test('handles fetch errors gracefully', async () => {
    fetchMock.mockReject(new Error('API is down'));

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
    });
  });
});
