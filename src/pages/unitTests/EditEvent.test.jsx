import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import EditEvent from '../editEvent';
import { useForm } from 'react-hook-form';

// Mock the dependencies
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: () => ({ id: '1' })
}));

jest.mock('react-hook-form', () => ({
    useForm: jest.fn()
}));

jest.mock('react-select', () => ({ options, ...rest }) => {
    return (
        <select data-testid="select" {...rest}>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
});

jest.mock('react-datepicker', () => ({ selected, onChange, ...rest }) => {
    return (
        <input
            data-testid="date-picker"
            type="date"
            value={selected || ''}
            onChange={(e) => onChange(new Date(e.target.value))}
            {...rest}
        />
    );
});

describe('EditEvent Component', () => {
    let mockRegister, mockHandleSubmit, mockSetValue, mockWatch;

    beforeEach(() => {
        mockRegister = jest.fn();
        mockHandleSubmit = jest.fn();
        mockSetValue = jest.fn();
        mockWatch = jest.fn();

        useForm.mockReturnValue({
            register: mockRegister,
            handleSubmit: mockHandleSubmit,
            setValue: mockSetValue,
            watch: mockWatch,
            formState: { errors: {} }
        });
    });

    it('renders form elements', async () => {
        render(
            <MemoryRouter>
                <EditEvent />
            </MemoryRouter>
        );

        expect(screen.getByLabelText('Event Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Event Description')).toBeInTheDocument();
        expect(screen.getByLabelText('Location')).toBeInTheDocument();
        expect(screen.getByTestId('select')).toBeInTheDocument();
        expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    });

    it('displays required validation messages when form is submitted with empty fields', async () => {
        mockHandleSubmit.mockImplementation((fn) => (e) => {
            e.preventDefault();
            fn({
                name: '',
                eventDesc: '',
                location: '',
                skills: [],
                date: ''
            });
        });

        render(
            <MemoryRouter>
                <EditEvent />
            </MemoryRouter>
        );

        fireEvent.submit(screen.getByText('Update Event'));

        await waitFor(() => {
            expect(screen.getByText('Name is required')).toBeInTheDocument();
            expect(
                screen.getByText('Description is required')
            ).toBeInTheDocument();
            expect(screen.getByText('Location is required')).toBeInTheDocument();
        });
    });

    it('fetches event data and populates fields correctly', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        name: 'Test Event',
                        description: 'Test Description',
                        location: 'Test Location',
                        date: '2024-10-01',
                        skills: ['Academics']
                    })
            })
        );

        render(
            <MemoryRouter>
                <EditEvent />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockSetValue).toHaveBeenCalledWith('name', 'Test Event');
            expect(mockSetValue).toHaveBeenCalledWith(
                'eventDesc',
                'Test Description'
            );
            expect(mockSetValue).toHaveBeenCalledWith('location', 'Test Location');
            expect(mockSetValue).toHaveBeenCalledWith('skills', [
                { value: 'Academics', label: 'Academics' }
            ]);
        });
    });

    it('handles form submission and displays success message', async () => {
        mockHandleSubmit.mockImplementation((fn) => (e) => {
            e.preventDefault();
            fn({
                name: 'Test Event',
                eventDesc: 'Test Description',
                location: 'Test Location',
                skills: [{ value: 'Academics', label: 'Academics' }],
                date: '2024-10-01'
            });
        });

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({})
            })
        );

        render(
            <MemoryRouter>
                <EditEvent />
            </MemoryRouter>
        );

        fireEvent.submit(screen.getByText('Update Event'));

        await waitFor(() => {
            expect(screen.getByText('Event updated successfully!')).toBeInTheDocument();
        });
    });

    it('displays error message if fetching event data fails', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: 'Failed to fetch event.' })
            })
        );

        render(
            <MemoryRouter>
                <EditEvent />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(
                screen.getByText('Failed to fetch event.')
            ).toBeInTheDocument();
        });
    });

    it('displays error message if form submission fails', async () => {
        mockHandleSubmit.mockImplementation((fn) => (e) => {
            e.preventDefault();
            fn({
                name: 'Test Event',
                eventDesc: 'Test Description',
                location: 'Test Location',
                skills: [{ value: 'Academics', label: 'Academics' }],
                date: '2024-10-01'
            });
        });

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: 'Failed to update event.' })
            })
        );

        render(
            <MemoryRouter>
                <EditEvent />
            </MemoryRouter>
        );

        fireEvent.submit(screen.getByText('Update Event'));

        await waitFor(() => {
            expect(screen.getByText('Failed to update event.')).toBeInTheDocument();
        });
    });
});
