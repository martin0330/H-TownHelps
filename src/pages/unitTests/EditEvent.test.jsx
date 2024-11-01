import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import EditEvent from '../editEvent';

// Utility to wrap component with Router for navigation
const renderWithRouter = (ui) => {
    return render(ui, { wrapper: BrowserRouter });
};

// Utility function to format date
const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};

describe('EditEvent Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Mock fetch function
    const mockFetch = (data, success = true) => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: success,
                json: () => Promise.resolve(data),
            })
        );
    };

    test('renders form fields correctly', async () => {
        const eventData = {
            name: 'Sample Event',
            description: 'Sample Description',
            location: 'Sample Location',
            date: '2023-12-01T00:00:00.000Z',
            skills: ['Academics', 'Arts'],
            people: ['Person 1', 'Person 2'],
        };
        
        mockFetch(eventData);

        renderWithRouter(<EditEvent />);

        expect(await screen.findByText(/Edit Event/i)).toBeInTheDocument();
        await waitFor(() => expect(screen.getByLabelText(/Event Name/i)).toHaveValue(eventData.name));
        await waitFor(() => expect(screen.getByLabelText(/Event Description/i)).toHaveValue(eventData.description));
        await waitFor(() => expect(screen.getByLabelText(/Location/i)).toHaveValue(eventData.location));
        expect(await screen.findByText(/Update Event/i)).toBeInTheDocument();
    });

    test('shows error messages if required fields are empty on submit', async () => {
        const eventData = {
            name: '',
            description: '',
            location: '',
            date: null,
            skills: [],
            people: []
        };
        
        mockFetch(eventData);
        
        renderWithRouter(<EditEvent />);
        
        // Wait for form to be loaded
        await waitFor(() => {
            expect(screen.getByText(/Edit Event/i)).toBeInTheDocument();
        });

        // Wait for all form fields to be loaded
        const nameInput = await screen.findByLabelText(/Event Name/i);
        const descriptionInput = await screen.findByLabelText(/Event Description/i);
        const locationInput = await screen.findByLabelText(/Location/i);

        // Clear the form fields (in case they have default values)
        fireEvent.change(nameInput, { target: { value: '' } });
        fireEvent.change(descriptionInput, { target: { value: '' } });
        fireEvent.change(locationInput, { target: { value: '' } });

        // Submit the form
        const submitButton = screen.getByText(/Update Event/i);
        fireEvent.click(submitButton);

        // Wait for and verify error messages
        await waitFor(() => {
            expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText(/Location is required/i)).toBeInTheDocument();
        });
    });

    test('fetches event data on mount and populates form', async () => {
        const eventData = {
            name: 'Test Event',
            description: 'This is a test description',
            location: 'Test Location',
            date: '2023-12-01T00:00:00.000Z',
            skills: ['Academics', 'Engineering'],
            people: ['John Doe'],
        };

        mockFetch(eventData);

        renderWithRouter(<EditEvent />);

        expect(await screen.findByText(/Edit Event/i)).toBeInTheDocument();
        await waitFor(() => expect(screen.getByLabelText(/Event Name/i)).toHaveValue('Test Event'));
        await waitFor(() => expect(screen.getByLabelText(/Event Description/i)).toHaveValue('This is a test description'));
        await waitFor(() => expect(screen.getByLabelText(/Location/i)).toHaveValue('Test Location'));
        expect(await screen.findByText(/Update Event/i)).toBeInTheDocument();
    });

    test('displays success message on successful form submission', async () => {
        const eventData = {
            name: 'Sample Event',
            description: 'Sample Description',
            location: 'Sample Location',
            date: '2023-12-01T00:00:00.000Z',
            skills: ['Academics', 'Arts'],
            people: ['Person 1', 'Person 2'],
        };

        mockFetch(eventData);

        renderWithRouter(<EditEvent />);

        expect(await screen.findByText(/Edit Event/i)).toBeInTheDocument();

        // Simulate form submission with mock fetch response
        global.fetch = jest.fn((url) => {
            if (url.includes('/api/updateEvent')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ message: 'Event updated successfully!' }),
                });
            }
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(eventData),
            });
        });

        expect(await screen.findByLabelText(/Event Name/i)).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText(/Event Name/i), { target: { value: 'Updated Event Name' } });
        fireEvent.click(screen.getByText(/Update Event/i));

        await waitFor(() => {
            expect(screen.getByText(/Event updated successfully!/i)).toBeInTheDocument();
        });
    });

    test('displays error message on failed form submission', async () => {
        const eventData = {
            name: 'Sample Event',
            description: 'Sample Description',
            location: 'Sample Location',
            date: '2023-12-01T00:00:00.000Z',
            skills: ['Academics', 'Arts'],
            people: ['Person 1', 'Person 2'],
        };

        mockFetch(eventData);

        renderWithRouter(<EditEvent />);

        expect(await screen.findByText(/Edit Event/i)).toBeInTheDocument();

        // Simulate failed form submission
        global.fetch = jest.fn((url) => {
            if (url.includes('/api/updateEvent')) {
                return Promise.resolve({
                    ok: false,
                    json: () => Promise.resolve({ error: 'Failed to update event.' }),
                });
            }
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(eventData),
            });
        });

        expect(await screen.findByLabelText(/Event Name/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Update Event/i));

        await waitFor(() => {
            expect(screen.getByText(/Failed to update event/i)).toBeInTheDocument();
        });
    });

    test('changes date on date picker selection', async () => {
        const eventData = {
            name: 'Sample Event',
            description: 'Sample Description',
            location: 'Sample Location',
            date: '2023-12-01T00:00:00.000Z',
            skills: ['Academics', 'Arts'],
            people: ['Person 1', 'Person 2'],
        };
        
        mockFetch(eventData);
        
        renderWithRouter(<EditEvent />);
        
        expect(await screen.findByText(/Edit Event/i)).toBeInTheDocument();
        
        // Create a specific date for testing
        const mockDate = new Date('2024-01-15');
        const formattedDate = formatDate(mockDate);
        
        // Wait for the date picker to be loaded and visible
        const datePicker = await screen.findByPlaceholderText(/Select event date/i);
        
        // Simulate date picker change with the formatted date string
        fireEvent.change(datePicker, {
            target: { value: formattedDate }
        });
        
        // Wait for and verify the new value
        await waitFor(() => {
            expect(datePicker).toHaveValue(formattedDate);
        });
    });
});