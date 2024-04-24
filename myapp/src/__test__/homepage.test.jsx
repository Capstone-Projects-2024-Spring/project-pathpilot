
import { render, screen } from '@testing-library/react';
import Welcome from '../home/Welcome';
import { MemoryRouter } from 'react-router-dom';

test("Home page renders successfully", () => {
    render(<MemoryRouter><Welcome /></MemoryRouter>);

    const element = screen.getByText(/Sit back, relax, and get ready to soar into your next Philly outing./i);
    expect(element).toBeInTheDocument();
})