
import { render, screen } from '@testing-library/react';
import NavabarBoot from '../general/Navbar';
import { MemoryRouter } from 'react-router-dom';

test("Home page renders successfully", () => {
    render(<MemoryRouter><NavabarBoot /></MemoryRouter>);

    const element = screen.getByAltText(/Path Pilot Logo/i);
    expect(element).toBeInTheDocument();
})