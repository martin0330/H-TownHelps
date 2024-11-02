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
  fetchMock.enableMocks();
  useAuth.mockReturnValue({ user: { userEmail: 'test@example.com' } });
});

afterEach(() => {
    fetchMock.resetMocks();
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
        const errorMessages = screen.getAllByText('This field is required');
        expect(errorMessages.length).toBe(4); // Adjust this number based on how many required fields you have
    });
});


    test('handles fetch errors gracefully', async () => {
        fetchMock.mockReject(new Error('API is down'));

        render(<UserProfile />);

        const submitButton = screen.getByText(/Save Profile/i);
        fireEvent.click(submitButton);

        // Debug the output
        screen.debug(); // This will log the current DOM structure to the console

        await waitFor(() => {
            expect(screen.getByText(/An error occurred\. Please try again\./i)).toBeInTheDocument();
        });
    });
});
