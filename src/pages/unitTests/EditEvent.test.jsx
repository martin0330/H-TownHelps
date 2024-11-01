import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import EditEvent from '../editEvent';

// Utility to wrap component with Router for navigation
const renderWithRouter = (ui) => {
    return render(ui, { wrapper: BrowserRouter });
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

        await waitFor(() => {
            expect(screen.getByLabelText(/Event Name/i)).toHaveValue(eventData.name);
            expect(screen.getByLabelText(/Event Description/i)).toHaveValue(eventData.description);
            expect(screen.getByLabelText(/Location/i)).toHaveValue(eventData.location);
            expect(screen.getByText(/Update Event/i)).toBeInTheDocument();
        });
    });

    test('shows error messages if required fields are empty on submit', async () => {
        const eventData = { name: 'Sample Event', description: '', location: '', date: null, skills: [] };
        
        mockFetch(eventData);
        
        renderWithRouter(<EditEvent />);

        await waitFor(() => {
            fireEvent.click(screen.getByText(/Update Event/i));
        });

        await waitFor(() => {
            expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Location is required/i)).toBeInTheDocument();
            expect(screen.getByText(/This field is required/i)).toBeInTheDocument();
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

        await waitFor(() => {
            expect(screen.getByLabelText(/Event Name/i)).toHaveValue('Test Event');
            expect(screen.getByLabelText(/Event Description/i)).toHaveValue('This is a test description');
            expect(screen.getByLabelText(/Location/i)).toHaveValue('Test Location');
            expect(screen.getByText(/Update Event/i)).toBeInTheDocument();
        });
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

        fireEvent.click(screen.getByText(/Update Event/i));

        await waitFor(() => {
            expect(screen.getByText(/Failed to update event/i)).toBeInTheDocument();
        });
    });

    test('changes date on date picker selection', async () => {
        renderWithRouter(<EditEvent />);
        const mockDate = new Date();

        // Simulate date picker change
        fireEvent.change(screen.getByPlaceholderText(/Select event date/i), {
            target: { value: mockDate },
        });

        await waitFor(() => {
            expect(screen.getByPlaceholderText(/Select event date/i)).toHaveValue(mockDate.toLocaleDateString());
        });
    });
});
