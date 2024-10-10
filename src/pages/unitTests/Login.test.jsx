// Login.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Login from '../login';

// Mocking the useNavigate hook from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockedUseNavigate = require('react-router-dom').useNavigate;

describe('Login Component', () => {
  beforeEach(() => {
    mockedUseNavigate.mockReset();  // Ensure the mock is cleared before each test
  });

  // Test 1: Renders login form
  test('renders the login form with email, password, and submit button', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Check if email input is rendered
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    
    // Check if password input is rendered
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    
    // Check if submit button is rendered
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  // Test 2: Displays validation error when email is missing
  test('shows validation error when email is missing', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Click submit without entering email or password
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    // Check for validation error for email
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
  });

  // Test 3: Displays validation error when password is missing
  test('shows validation error when password is missing', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Enter email but no password
    fireEvent.input(screen.getByLabelText(/Email/i), {
      target: { value: 'johndoe@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    // Check for validation error for password
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
  });

  // Test 4: Submits form successfully and navigates to /main
  test('submits form with valid data and navigates to /main', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Fill in email and password
    fireEvent.input(screen.getByLabelText(/Email/i), {
      target: { value: 'johndoe@example.com' },
    });

    fireEvent.input(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    // Click submit
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    // Check if useNavigate was called with the correct path
    expect(mockedUseNavigate).toHaveBeenCalledWith('/main');
  });

  // Test 5: Sign up link directs to the registration page
  test('has a sign-up link that navigates to registration page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registration" element={<div>Registration Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Click the sign-up link
    fireEvent.click(screen.getByText(/Sign up here!/i));

    // Verify that the path has changed to /registration
    expect(screen.getByText(/Registration Page/i)).toBeInTheDocument();
  });
});
