import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import EventManage from '../event-manage';
import '@testing-library/jest-dom';

// Mock react-select and react-datepicker as above
jest.mock('react-select', () => (props) => {
    return (
        <select
            data-testid="select"
            multiple
            value={props.value || []}
            onChange={(e) => {
                const selectedOptions = [...e.target.options]
                    .filter(option => option.selected)
                    .map(option => ({ value: option.value, label: option.label }));
                props.onChange(selectedOptions);
            }}
        >
            {props.options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
});

jest.mock('react-datepicker', () => ({ selected, onChange }) => {
    return (
        <input
            type="date"
            data-testid="datepicker"
            value={selected ? selected.toISOString().split('T')[0] : ''}
            onChange={(e) => onChange(new Date(e.target.value))} 
        />
    );
});

describe('EventManage Component', () => {
    test('renders form fields and handles form submission', async () => {
        render(<EventManage />);
        
        // Simulate input change for event name field
        fireEvent.change(screen.getByLabelText(/Event Name/i), {
            target: { value: 'Sample Event' },
        });

        // Simulate form submission
        fireEvent.click(screen.getByText(/Submit/i));

        // Expect error message for required fields
        expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    });
});
