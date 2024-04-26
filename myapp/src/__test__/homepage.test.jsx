
import { render, screen } from '@testing-library/react';
import HomePage from '../home/HomePage';
import { MemoryRouter } from 'react-router-dom';

test("Home page renders successfully", () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);

    const element = screen.getByText(/Sit back, relax, and get ready to soar into your next Philly outing./i);
    expect(element).toBeInTheDocument();
})