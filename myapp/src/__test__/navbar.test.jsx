
import { render, screen, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import NavabarBoot from '../general/Navbar';
import { MemoryRouter } from 'react-router-dom';

beforeEach(() => {
    localStorage.removeItem("username");
  });

test("Home page renders successfully", () => {
    render(<MemoryRouter><NavabarBoot /></MemoryRouter>);

    const element = screen.getByAltText(/Path Pilot Logo/i);
    expect(element).toBeInTheDocument();

    const element2 = screen.getByText(/Log in/i);
    expect(element2).toBeInTheDocument();
})
test("Navbar loggin in", async () => {
    localStorage.setItem("username","test");

    render(<MemoryRouter><NavabarBoot /></MemoryRouter>);

    const element = screen.getByText("Log Out");
    expect(element).toBeInTheDocument();
    fireEvent.click(element);
    console.log(localStorage.getItem("username"));
});