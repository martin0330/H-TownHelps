import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/authContext';
import Login from '../login';

// Mock the useAuth hook
jest.mock('../../components/authContext', () => ({
    useAuth: jest.fn(),
}));

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Login Component', () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
      // Set up mock implementations
      useAuth.mockReturnValue({ login: mockLogin });
      useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
      jest.clearAllMocks();
  });

  test('renders login form with email, password fields and submit button', () => {
      render(
          <MemoryRouter>
              <Login />
          </MemoryRouter>
      );

      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('displays required error when form fields are empty', async () => {
      render(
          <MemoryRouter>
              <Login />
          </MemoryRouter>
      );

      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
      expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  test('displays error message on failed login', async () => {
      // Mock the fetch function to simulate a failed login response
      global.fetch = jest.fn(() =>
          Promise.resolve({
              ok: false,
              json: () => Promise.resolve({ error: 'Invalid credentials' }),
          })
      );

      render(
          <MemoryRouter>
              <Login />
          </MemoryRouter>
      );

      fireEvent.change(screen.getByLabelText(/email address/i), {
          target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
          target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  test('calls login and navigates on successful login', async () => {
      // Mock the fetch function to simulate a successful login response
      global.fetch = jest.fn(() =>
          Promise.resolve({
              ok: true,
              json: () => Promise.resolve({}),
          })
      );

      render(
          <MemoryRouter>
              <Login />
          </MemoryRouter>
      );

      fireEvent.change(screen.getByLabelText(/email address/i), {
          target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
          target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({ userEmail: 'test@example.com' }));
      expect(mockNavigate).toHaveBeenCalledWith('/main');
  });
});