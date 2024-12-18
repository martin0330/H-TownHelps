import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventList from '../eventList';
import { useAuth } from '../../components/authContext';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../components/authContext', () => ({
    useAuth: jest.fn(),
}));

global.fetch = jest.fn();

const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('EventList Component', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('renders EventList component', async () => {
        useAuth.mockReturnValue({ user: { userEmail: 'user@example.com' } });
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                {
                    _id: '1',
                    name: 'Sample Event',
                    description: 'This is a sample event.',
                    location: 'Location 1',
                    date: '2024-12-25T00:00:00Z',
                    skills: ['Skill 1', 'Skill 2'],
                    people: ['Person 1', 'Person 2'],
                },
            ],
        });
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ access: true }),
        });

        renderWithRouter(<EventList />);

        expect(await screen.findByText('Event List')).toBeInTheDocument();
        expect(await screen.findByText('Sample Event')).toBeInTheDocument();
        expect(await screen.findByText('This is a sample event.')).toBeInTheDocument();
    });

    test('displays error message on fetch failure', async () => {
        useAuth.mockReturnValue({ user: { userEmail: 'user@example.com' } });
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Failed to fetch events' }),
        });
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ access: true }),
        });

        renderWithRouter(<EventList />);

        expect(await screen.findByText('Failed to fetch events')).toBeInTheDocument();
    });

    test('shows Add Event button for admin access', async () => {
        useAuth.mockReturnValue({ user: { userEmail: 'admin@example.com' } });
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                {
                    _id: '1',
                    name: 'Sample Event',
                    description: 'This is a sample event.',
                    location: 'Location 1',
                    date: '2024-12-25T00:00:00Z',
                    skills: ['Skill 1', 'Skill 2'],
                    people: ['Person 1', 'Person 2'],
                },
            ],
        });
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ access: true }),
        });

        renderWithRouter(<EventList />);

        expect(await screen.findByText('Add Event')).toBeInTheDocument();
    });

    test('allows admin to delete an event', async () => {
        useAuth.mockReturnValue({ user: { userEmail: 'admin@example.com' } });
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                {
                    _id: '1',
                    name: 'Sample Event',
                    description: 'This is a sample event.',
                    location: 'Location 1',
                    date: '2024-12-25T00:00:00Z',
                    skills: ['Skill 1', 'Skill 2'],
                    people: ['Person 1', 'Person 2'],
                },
            ],
        });
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ access: true }),
        });
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        renderWithRouter(<EventList />);

        expect(await screen.findByRole('button', { name: /delete event/i })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /delete event/i }));
        await waitFor(() => expect(screen.queryByText('Sample Event')).not.toBeInTheDocument());
    });

    test('allows admin to edit an event', async () => {
        useAuth.mockReturnValue({ user: { userEmail: 'admin@example.com' } });
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                {
                    _id: '1',
                    name: 'Sample Event',
                    description: 'This is a sample event.',
                    location: 'Location 1',
                    date: '2024-12-25T00:00:00Z',
                    skills: ['Skill 1', 'Skill 2'],
                    people: ['Person 1', 'Person 2'],
                },
            ],
        });
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ access: true }),
        });

        renderWithRouter(<EventList />);
        
        const editButton = await screen.findByRole('button', { name: /edit event/i });
        fireEvent.click(editButton);

        expect(screen.getByText('Event List')).toBeInTheDocument();  // Check if on EventList page
    });
});