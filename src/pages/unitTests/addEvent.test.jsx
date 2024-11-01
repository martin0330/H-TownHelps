import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import EventManage from '../addEvent';
import * as router from 'react-router-dom';

// Mock the modules
jest.mock('react-select', () => ({ __esModule: true, default: (props) => {
    return (
        <select 
            onChange={e => props.onChange({ value: e.target.value })}
            value={props.value}
            aria-label="Available Users"
        >
            <option value="1">User 1</option>
        </select>
    );
}}));

jest.mock('react-datepicker', () => ({ __esModule: true, default: (props) => {
    return (
        <input
            type="date"
            onChange={e => props.onChange(new Date(e.target.value))}
            value={props.selected}
            aria-label="Event Date"
        />
    );
}}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const renderWithRouter = (ui) => {
    return render(ui, { wrapper: BrowserRouter });
};

describe('EventManage Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    test('renders the form fields correctly', () => {
        renderWithRouter(<EventManage />);
        expect(screen.getByLabelText(/Event Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Event Description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Event Date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Available Users/i)).toBeInTheDocument();
        expect(screen.getByText(/Create Event/i)).toBeInTheDocument();
    });

    test('shows error message if required fields are missing on submit', async () => {
        renderWithRouter(<EventManage />);
        
        // Click submit without filling in any fields
        fireEvent.click(screen.getByText(/Create Event/i));

        expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/Description is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/Location is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/Event date is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/At least one user must be selected/i)).toBeInTheDocument();
    });

    test('calls fetchAvailableUsers API on date selection', async () => {
        renderWithRouter(<EventManage />);
        
        const mockDate = '2024-12-25';
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([{ _id: '1', fullName: 'User 1' }])
        });

        const dateInput = screen.getByLabelText(/Event Date/i);
        fireEvent.change(dateInput, { target: { value: mockDate } });

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/availableUsers'));
        });
    });

    test('displays success message on successful form submission', async () => {
        renderWithRouter(<EventManage />);

        // Mock successful API responses
        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([{ _id: '1', fullName: 'User 1' }])
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ message: 'Event added successfully!' })
            });

        // Fill in the form
        fireEvent.change(screen.getByLabelText(/Event Name/i), {
            target: { value: 'Sample Event' }
        });
        fireEvent.change(screen.getByLabelText(/Event Description/i), {
            target: { value: 'Test Description' }
        });
        fireEvent.change(screen.getByLabelText(/Location/i), {
            target: { value: 'Test Location' }
        });
        fireEvent.change(screen.getByLabelText(/Event Date/i), {
            target: { value: '2024-12-25' }
        });
        fireEvent.change(screen.getByLabelText(/Available Users/i), {
            target: { value: '1' }
        });

        // Submit the form
        fireEvent.click(screen.getByText(/Create Event/i));

        await waitFor(() => {
            expect(screen.getByText(/Event added successfully!/i)).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/events');
        });
    });

    test('displays error message on failed form submission', async () => {
        renderWithRouter(<EventManage />);

        // Mock API responses
        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([{ _id: '1', fullName: 'User 1' }])
            })
            .mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({ error: 'Failed to submit event' })
            });

        // Fill in the form
        fireEvent.change(screen.getByLabelText(/Event Name/i), {
            target: { value: 'Sample Event' }
        });
        fireEvent.change(screen.getByLabelText(/Event Description/i), {
            target: { value: 'Test Description' }
        });
        fireEvent.change(screen.getByLabelText(/Location/i), {
            target: { value: 'Test Location' }
        });
        fireEvent.change(screen.getByLabelText(/Event Date/i), {
            target: { value: '2024-12-25' }
        });
        fireEvent.change(screen.getByLabelText(/Available Users/i), {
            target: { value: '1' }
        });

        // Submit the form
        fireEvent.click(screen.getByText(/Create Event/i));

        await waitFor(() => {
            expect(screen.getByText(/Failed to submit event/i)).toBeInTheDocument();
        });
    });
});