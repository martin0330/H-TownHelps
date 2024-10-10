import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Registration from '../registration'; // Adjust the import based on your file structure
import '@testing-library/jest-dom/extend-expect'; // for the toBeInTheDocument matcher

describe('Registration Component', () => {

  beforeEach(() => {
    render(<Registration />);
  });

  test('renders all input fields and the submit button', () => {
    // Check if all input fields are present
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Re-type Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    // Submit the form without filling the fields
    fireEvent.click(submitButton);

    // Expect validation errors (HTML5 built-in validation)
    expect(screen.getByLabelText(/First Name/i)).toBeInvalid();
    expect(screen.getByLabelText(/Last Name/i)).toBeInvalid();
    expect(screen.getByLabelText(/Email/i)).toBeInvalid();
    expect(screen.getByLabelText(/Password/i)).toBeInvalid();
    expect(screen.getByLabelText(/Re-type Password/i)).toBeInvalid();
    expect(screen.getByLabelText(/Gender/i)).toBeInvalid();
  });

  test('validates password field requirements', () => {
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    // Enter a password that doesn't meet the pattern
    fireEvent.change(passwordInput, { target: { value: 'abc123' } });
    fireEvent.click(submitButton);

    // Expect the password field to be invalid due to pattern mismatch
    expect(passwordInput).toBeInvalid();
  });

  test('submits form with valid data', () => {
    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const rePasswordInput = screen.getByLabelText(/Re-type Password/i);
    const genderSelect = screen.getByLabelText(/Gender/i);
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    // Fill in the form with valid data
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(rePasswordInput, { target: { value: 'Password123!' } });
    fireEvent.change(genderSelect, { target: { value: 'male' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Mock the console log to verify submission
    const consoleSpy = jest.spyOn(console, 'log');
    expect(consoleSpy).toHaveBeenCalledWith({
      first: 'John',
      last: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password123!',
      repassword: 'Password123!',
      gender: 'male',
    });
  });
});
