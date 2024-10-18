import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import EventList from './event-list';
import { useAuth } from '../components/authContext';
import { BrowserRouter } from 'react-router-dom';

// Mock useAuth
jest.mock('../components/authContext', () => ({
  useAuth: jest.fn(),
}));

// Mock navigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Mock fetch calls
global.fetch = jest.fn();

describe('EventList component', () => {
  const mockUser = { userEmail: 'admin@example.com' };
  
  beforeEach(() => {
    fetch.mockClear();
    useAuth.mockReturnValue({ user: mockUser });
  });

  test('should display events when fetched successfully', async () => {
    const mockEvents = [
      {
        _id: '1',
        name: 'Event 1',
        description: 'Description 1',
        location: 'Location 1',
        date: '2024-12-01T00:00:00Z',
        skills: ['Skill 1', 'Skill 2'],
        people: ['Person 1', 'Person 2'],
      },
      {
        _id: '2',
        name: 'Event 2',
        description: 'Description 2',
        location: 'Location 2',
        date: '2024-12-02T00:00:00Z',
        skills: ['Skill 3'],
        people: ['Person 3'],
      },
    ];

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access: true }),
      });

    render(
      <BrowserRouter>
        <EventList />
      </BrowserRouter>
    );

    // Check if loading message appears initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for events to be rendered
    await waitFor(() => expect(screen.getByText('Event 1')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Event 2')).toBeInTheDocument());
    
    // Check if the event details are displayed
    expect(screen.getByText(/Location: Location 1/)).toBeInTheDocument();
    expect(screen.getByText(/Skills: Skill 1, Skill 2/)).toBeInTheDocument();
    expect(screen.getByText(/People: Person 1, Person 2/)).toBeInTheDocument();
  });

  test('should display add event button for admins', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access: true }),
      });

    render(
      <BrowserRouter>
        <EventList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/add event/i)).toBeInTheDocument();
    });
  });

  test('should delete event when delete button is clicked', async () => {
    const mockEvents = [
      {
        _id: '1',
        name: 'Event 1',
        description: 'Description 1',
        location: 'Location 1',
        date: '2024-12-01T00:00:00Z',
        skills: ['Skill 1', 'Skill 2'],
        people: ['Person 1', 'Person 2'],
      },
    ];

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

    render(
      <BrowserRouter>
        <EventList />
      </BrowserRouter>
    );

    // Wait for events to be rendered
    await waitFor(() => expect(screen.getByText('Event 1')).toBeInTheDocument());

    // Click the delete button
    fireEvent.click(screen.getByText(/delete event/i));

    // Ensure the event is removed from the DOM
    await waitFor(() => expect(screen.queryByText('Event 1')).not.toBeInTheDocument());
  });

  test('should navigate to edit event form when edit button is clicked', async () => {
    const mockEvents = [
      {
        _id: '1',
        name: 'Event 1',
        description: 'Description 1',
        location: 'Location 1',
        date: '2024-12-01T00:00:00Z',
        skills: ['Skill 1', 'Skill 2'],
        people: ['Person 1', 'Person 2'],
      },
    ];

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access: true }),
      });

    render(
      <BrowserRouter>
        <EventList />
      </BrowserRouter>
    );

    // Wait for events to be rendered
    await waitFor(() => expect(screen.getByText('Event 1')).toBeInTheDocument());

    // Click the edit button
    fireEvent.click(screen.getByText(/edit event/i));

    // Check if navigation occurred with correct event id
    expect(mockedNavigate).toHaveBeenCalledWith('/editEvent/1');
  });
});
