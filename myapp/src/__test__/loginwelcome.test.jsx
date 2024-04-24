
import { render, screen } from '@testing-library/react';
import LoginWelcome from '../login/LoginWelcome';

test("Home page renders successfully", () => {
    render(<LoginWelcome />);

    const element = screen.getByAltText(/Path Pilot Logo/i);
    expect(element).toBeInTheDocument();
})