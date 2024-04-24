
import { render, screen, fireEvent } from '@testing-library/react';
import UserInput from '../login/UserInput';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

test("Log in page renders successfully", () => {
    render(<MemoryRouter><UserInput /></MemoryRouter>);
    const element = screen.getByText(/Username/i);
    expect(element).toBeInTheDocument();

    const element2 = screen.getByPlaceholderText(/username/i);
    expect(element2).toBeInTheDocument();
});

/**est("renders LoginComp correctly", async () => {
    const originalConsoleLog = console.log;
    console.log = jest.fn();

    const {getByText} = render(<MemoryRouter>< UserInput /></MemoryRouter>);
    await fireEvent.click(getByText('Submit'));
    expect(console.log).toHaveBeenCalled();

    console.log = originalConsoleLog;
});*/