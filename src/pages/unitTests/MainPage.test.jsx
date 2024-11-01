import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainPage from '../mainPage';

describe('MainPage Component', () => {
    test('renders title and description', () => {
        render(
            <MemoryRouter>
                <MainPage />
            </MemoryRouter>
        );

        // Check that the main title is rendered
        expect(
            screen.getByRole('heading', { name: /welcome to h-townhelps!/i })
        ).toBeInTheDocument();

        // Check that the description is rendered
        expect(
            screen.getByText(/manage your events, match with volunteer opportunities, and more./i)
        ).toBeInTheDocument();
    });

    test('renders navigation links with correct text and URLs', () => {
        render(
            <MemoryRouter>
                <MainPage />
            </MemoryRouter>
        );

        // Check that "View Events" link is rendered and points to /events
        const eventsLink = screen.getByRole('link', { name: /view events/i });
        expect(eventsLink).toBeInTheDocument();
        expect(eventsLink).toHaveAttribute('href', '/events');

        // Check that "Volunteer Matching" link is rendered and points to /volunteer-match
        const volunteerMatchLink = screen.getByRole('link', { name: /volunteer matching/i });
        expect(volunteerMatchLink).toBeInTheDocument();
        expect(volunteerMatchLink).toHaveAttribute('href', '/volunteer-match');

        // Check that "View Notifications" link is rendered and points to /notifications
        const notificationsLink = screen.getByRole('link', { name: /view notifications/i });
        expect(notificationsLink).toBeInTheDocument();
        expect(notificationsLink).toHaveAttribute('href', '/notifications');

        // Check that "Volunteer History" link is rendered and points to /volunteerhist
        const volunteerHistLink = screen.getByRole('link', { name: /volunteer history/i });
        expect(volunteerHistLink).toBeInTheDocument();
        expect(volunteerHistLink).toHaveAttribute('href', '/volunteerhist');
    });
});
