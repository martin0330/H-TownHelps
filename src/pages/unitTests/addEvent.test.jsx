import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddEvent from '../addEvent';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (ui) => {
    return render(ui, { wrapper: BrowserRouter });
};

describe('AddEvent Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the form fields correctly', () => {
        renderWithRouter(<AddEvent />);
        expect(screen.getByLabelText(/Event Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Event Description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Event Date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Available Users/i)).toBeInTheDocument();
        expect(screen.getByText(/Create Event/i)).toBeInTheDocument();
    });

    test('shows error message if required fields are missing on submit', async () => {
        renderWithRouter(<AddEvent />);
        fireEvent.click(screen.getByText(/Create Event/i));
        await waitFor(() => {
            expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Location is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Event date is required/i)).toBeInTheDocument();
            expect(screen.getByText(/At least one user must be selected/i)).toBeInTheDocument();
        });
    });

    test('calls fetchAvailableUsers API on date selection', async () => {
        renderWithRouter(<AddEvent />);
        
        const mockDate = new Date();
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([{ _id: '1', fullName: 'User 1' }]),
            })
        );

        fireEvent.change(screen.getByLabelText(/Event Date/i), { target: { value: mockDate } });

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(`http://localhost:5000/api/availableUsers?date=${mockDate.toISOString()}`);
        });
    });

    test('displays success message on successful form submission', async () => {
        renderWithRouter(<AddEvent />);

        global.fetch = jest.fn().mockImplementation((url) => {
            if (url.includes('/api/addEvent')) {
                return Promise.resolve({ ok: true, json: () => Promise.resolve({ message: 'Event added successfully!' }) });
            }
            return Promise.resolve({ ok: true, json: () => Promise.resolve([{ _id: '1', fullName: 'User 1' }]) });
        });

        fireEvent.change(screen.getByLabelText(/Event Name/i), { target: { value: 'Sample Event' } });
        fireEvent.change(screen.getByLabelText(/Event Description/i), { target: { value: 'This is a test event description' } });
        fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'New York' } });
        fireEvent.change(screen.getByLabelText(/Event Date/i), { target: { value: new Date() } });
        fireEvent.change(screen.getByLabelText(/Available Users/i), { target: { value: [{ value: '1', label: 'User 1' }] } });

        fireEvent.click(screen.getByText(/Create Event/i));

        await waitFor(() => {
            expect(screen.getByText(/Event added successfully!/i)).toBeInTheDocument();
        });
    });

    test('displays error message on failed form submission', async () => {
        renderWithRouter(<AddEvent />);

        global.fetch = jest.fn().mockImplementation((url) => {
            if (url.includes('/api/addEvent')) {
                return Promise.resolve({
                    ok: false,
                    json: () => Promise.resolve({ error: 'Failed to submit event' }),
                });
            }
            return Promise.resolve({ ok: true, json: () => Promise.resolve([{ _id: '1', fullName: 'User 1' }]) });
        });

        fireEvent.change(screen.getByLabelText(/Event Name/i), { target: { value: 'Sample Event' } });
        fireEvent.change(screen.getByLabelText(/Event Description/i), { target: { value: 'This is a test event description' } });
        fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'New York' } });
        fireEvent.change(screen.getByLabelText(/Event Date/i), { target: { value: new Date() } });
        fireEvent.change(screen.getByLabelText(/Available Users/i), { target: { value: [{ value: '1', label: 'User 1' }] } });

        fireEvent.click(screen.getByText(/Create Event/i));

        await waitFor(() => {
            expect(screen.getByText(/Failed to submit event/i)).toBeInTheDocument();
        });
    });
});
