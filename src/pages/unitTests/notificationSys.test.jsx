import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useAuth } from '../../components/authContext';
import NotificationPage from '../notifications'; // Adjust the import path as necessary
import '@testing-library/jest-dom'; // Import this to use `toBeInTheDocument`

// Mock the useAuth hook
jest.mock('../../components/authContext', () => ({
    useAuth: jest.fn(),
}));

// Mock the fetch API
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
            { id: 1, message: 'Notification 1', type: 'info', date: '2023-01-01' },
            { id: 2, message: 'Notification 2', type: 'info', date: '2023-01-02' },
        ]),
    })
);

describe('NotificationPage Component', () => {
    beforeEach(() => {
        fetch.mockClear();
        useAuth.mockReturnValue({ user: { userEmail: 'test@example.com' } });
    });

    test('renders the notifications title', () => {
        render(<NotificationPage />);
        expect(screen.getByRole('heading', { name: /notifications/i })).toBeInTheDocument();
    });

    test('fetches and displays notifications', async () => {
        render(<NotificationPage />);
        
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/getNotifications',
                expect.any(Object)
            );
        });

        expect(await screen.findByText(/notification 1/i)).toBeInTheDocument();
        expect(await screen.findByText(/notification 2/i)).toBeInTheDocument();
    });

    test('displays no notifications message when there are none', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]),
            })
        );

        render(<NotificationPage />);

        await waitFor(() => {
            expect(screen.getByText(/no notifications available/i)).toBeInTheDocument();
        });
    });

    test('handles error when fetching notifications', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: 'Failed to fetch notifications' }),
            })
        );

        render(<NotificationPage />);

        await waitFor(() => {
            expect(screen.getByText(/no notifications available/i)).toBeInTheDocument();
        });
    });
    
});