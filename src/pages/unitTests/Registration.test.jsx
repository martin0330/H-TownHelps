// Registration.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Registration from '../registration';

global.fetch = jest.fn();

const renderComponent = () =>
  render(
    <BrowserRouter>
      <Registration />
    </BrowserRouter>
  );

describe('Registration Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders all form fields correctly', () => {
    renderComponent();

    // Check for form fields
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Re-type Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  test('displays success message on successful registration', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Registration successful!' }),
    });

    renderComponent();

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Pass@1234' } });
    fireEvent.change(screen.getByLabelText(/Re-type Password/i), { target: { value: 'Pass@1234' } });
    fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'male' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    // Check for success message
    await waitFor(() => expect(screen.getByText('Registration successful!')).toBeInTheDocument());
  });

  test('displays error message on failed registration', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Registration failed' }),
    });

    renderComponent();

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Pass@1234' } });
    fireEvent.change(screen.getByLabelText(/Re-type Password/i), { target: { value: 'Pass@1234' } });
    fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'male' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    // Check for error message
    await waitFor(() => expect(screen.getByText(/Error:/)).toBeInTheDocument());
    expect(screen.getByText(/Registration failed/)).toBeInTheDocument();
  });

  test('displays password validation error', async () => {
    renderComponent();

    // Enter invalid password
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/Re-type Password/i), { target: { value: 'password' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    // Check for validation message
    await waitFor(() =>
      expect(screen.getByText(/Password must contain at least one number, one alphabet, one symbol, and be at least 8 characters long/)).toBeInTheDocument()
    );
  });
});
