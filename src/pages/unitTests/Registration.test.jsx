import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/authContext';
import Register from '../registration';

// Mock the useAuth hook
jest.mock('../../components/authContext', () => ({
    useAuth: jest.fn(),
}));

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Register Component', () => {
  const mockRegister = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
      // Set up mock implementations
      useAuth.mockReturnValue({ register: mockRegister });
      useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
      jest.clearAllMocks();
  });

  test('renders registration form with email, password fields and submit button', () => {
      render(
          <MemoryRouter>
              <Register />
          </MemoryRouter>
      );

      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('displays required error when form fields are empty', async () => {
      render(
          <MemoryRouter>
              <Register />
          </MemoryRouter>
      );

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
      expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  test('displays error message on failed registration', async () => {
      // Mock the fetch function to simulate a failed registration response
      global.fetch = jest.fn(() =>
          Promise.resolve({
              ok: false,
              json: () => Promise.resolve({ error: 'Registration failed' }),
          })
      );

      render(
          <MemoryRouter>
              <Register />
          </MemoryRouter>
      );

      fireEvent.change(screen.getByLabelText(/email address/i), {
          target: { value: 'newuser@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
          target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      expect(await screen.findByText(/registration failed/i)).toBeInTheDocument();
  });

  test('calls register and navigates on successful registration', async () => {
      // Mock the fetch function to simulate a successful registration response
      global.fetch = jest.fn(() =>
          Promise.resolve({
              ok: true,
              json: () => Promise.resolve({}),
          })
      );

      render(
          <MemoryRouter>
              <Register />
          </MemoryRouter>
      );

      fireEvent.change(screen.getByLabelText(/email address/i), {
          target: { value: 'newuser@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'password123' },
    });
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
        expect(mockRegister).toHaveBeenCalled();
        console.log("Called with:", mockRegister.mock.calls);
    });
    expect(mockRegister).toHaveBeenCalledWith({ userEmail: 'newuser@example.com' });
    
  });
});
