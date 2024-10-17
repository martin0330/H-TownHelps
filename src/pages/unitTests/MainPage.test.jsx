import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from "react-router-dom";
import MainPage from "../main-page"; 


describe("MainPage Component", () => {
  
  beforeEach(() => {
    render(
      <BrowserRouter>
        <MainPage />
      </BrowserRouter>
    );
  });

  test("renders the welcome message and description", () => {
    // Check if the header and description are rendered
    expect(screen.getByText("Welcome to H-TownHelps!")).toBeInTheDocument();
    expect(screen.getByText("Manage your events, match with volunteer opportunities, and more.")).toBeInTheDocument();
  });

  test("renders all navigation links", () => {
    // Check if all navigation links are rendered with correct text
    expect(screen.getByText("Manage Events")).toBeInTheDocument();
    expect(screen.getByText("Volunteer Matching")).toBeInTheDocument();
    expect(screen.getByText("View Notifications")).toBeInTheDocument();
    expect(screen.getByText("Volunteer History")).toBeInTheDocument();
  });

  test("links have the correct paths", () => {
    // Check if all links have correct href paths
    expect(screen.getByText("Manage Events").closest('a')).toHaveAttribute('href', '/eventmanage');
    expect(screen.getByText("Volunteer Matching").closest('a')).toHaveAttribute('href', '/volunteermatch');
    expect(screen.getByText("View Notifications").closest('a')).toHaveAttribute('href', '/notifications');
    expect(screen.getByText("Volunteer History").closest('a')).toHaveAttribute('href', '/volunteerhist');
  });
});
