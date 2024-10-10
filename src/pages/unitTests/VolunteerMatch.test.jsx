import React from 'react';
import { render, screen } from '@testing-library/react';
import VolunteerMatchingForm from '../volunteer-match'; // Adjust the import based on your file structure

// Mocking the console.log for tests
global.console = {
  log: jest.fn(),
};

describe('VolunteerMatchingForm Component', () => {
  beforeEach(() => {
    render(<VolunteerMatchingForm />);
  });

  test('renders Volunteer Matching Form title', () => {
    const titleElement = screen.getByText(/volunteer matching form/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders volunteer name input', () => {
    const volunteerNameInput = screen.getByLabelText(/volunteer name/i);
    expect(volunteerNameInput).toBeInTheDocument();
    expect(volunteerNameInput).toHaveValue('John Doe');
    expect(volunteerNameInput).toBeDisabled();
  });

  test('renders matched event input', () => {
    const matchedEventInput = screen.getByLabelText(/matched event/i);
    expect(matchedEventInput).toBeInTheDocument();
    expect(matchedEventInput).toHaveValue('Community Cleanup Drive');
    expect(matchedEventInput).toBeDisabled();
  });

  test('renders event details when available', async () => {
    const skillsRequired = await screen.findByText(/skills required/i);
    expect(skillsRequired).toBeInTheDocument();
    expect(screen.getByText(/teamwork, physical stamina/i)).toBeInTheDocument();
    expect(screen.getByText(/sep 30, 2024/i)).toBeInTheDocument();
    expect(screen.getByText(/9:00 am - 12:00 pm/i)).toBeInTheDocument();
    expect(screen.getByText(/main park/i)).toBeInTheDocument();
  });

  test('renders Confirm Match button', () => {
    const confirmButton = screen.getByRole('button', { name: /confirm match/i });
    expect(confirmButton).toBeInTheDocument();
  });

  test('renders event image', () => {
    const image = screen.getByAltText(/volunteer event/i);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://media.istockphoto.com/id/1351442130/photo/multiracial-volunteers-planting-in-public-park.jpg?s=612x612&w=0&k=20&c=AaM1yRn6w6XZ_R78osWzHptRvMAKK5lmNuJACb6opic=');
  });
});
