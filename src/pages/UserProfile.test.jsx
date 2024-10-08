import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import UserProfile from './user-profile';
import '@testing-library/jest-dom';


describe('UserProfile Component', () => {
    test('renders form fields correctly', () => {
        render(<UserProfile />);

        // Check if the required form fields are present
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Address 1/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Zip Code/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Skills/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Availability/i)).toBeInTheDocument();
    });

    test('renders error messages when required fields are empty', async () => {
        render(<UserProfile />);
    
        // Find the submit button
        const submitButton = screen.getByRole('button', { name: /submit/i });
        
        // Click the submit button
        fireEvent.click(submitButton);
    
        // Check for required error messages
        expect(await screen.findByText(/this field is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/this field is required/i)).toBeInTheDocument();
        
        // You can also check specific fields if needed
        expect(await screen.findByText(/this field is required/i, { selector: 'p' })).toBeInTheDocument();
    });

    test('fills and submits form without validation errors', async () => {
        const { getByLabelText, getByRole, queryByText } = render(<UserProfile />);

        // Fill out the form fields
        fireEvent.change(getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
        fireEvent.change(getByLabelText(/Address 1/i), { target: { value: '123 Main St' } });
        fireEvent.change(getByLabelText(/City/i), { target: { value: 'New York' } });
        fireEvent.change(getByLabelText(/Zip Code/i), { target: { value: '10001' } });

        // Simulate form submission
        fireEvent.click(getByRole('button', { name: /Submit/i }));

        // No validation errors should appear
        expect(queryByText(/This field is required/i)).not.toBeInTheDocument();
    });

    test('renders state label and Select', () => {
        render(<UserProfile />);
        
        // Check if the state label is in the document
        const stateLabel = screen.getByLabelText(/state/i);
        expect(stateLabel).toBeInTheDocument();
    
        // Optionally check if the Select component is present
        const stateSelect = screen.getByRole('combobox', { name: /state/i }); // 'combobox' role for Select
        expect(stateSelect).toBeInTheDocument();
    });

    test('adds and removes dates in the availability section', () => {
        const { getByText, getByRole } = render(<UserProfile />);

        // Simulate selecting a date
        const currentDate = new Date();
        act(() => {
            fireEvent.click(screen.getByText(currentDate.getDate().toString()));
        });

        // Ensure the selected date is rendered
        expect(getByText(currentDate.toDateString())).toBeInTheDocument();

        // Simulate removing a date
        fireEvent.click(getByText(/Remove/i));

        // Ensure the date is removed
        expect(screen.queryByText(currentDate.toDateString())).not.toBeInTheDocument();
    });
});
