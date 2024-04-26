
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../login/Login';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

jest.mock('axios');

test("Log in page renders successfully", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    const element = screen.getByText(/Username/i);
    expect(element).toBeInTheDocument();

    const element2 = screen.getByPlaceholderText(/username/i);
    expect(element2).toBeInTheDocument();
});

test("Input user info success", async () => {
    const payload = {data: {user: "testuser", message:"successful"}};
    axios.post.mockResolvedValue(payload);
    render(<MemoryRouter><Login /></MemoryRouter>);
    const element = screen.getByText(/Username/i);
    expect(element).toBeInTheDocument();

    const username = screen.getByPlaceholderText(/username/i);
    await userEvent.type(username, 'testuser');

    const password = screen.getByPlaceholderText(/password/i);
    await userEvent.type(password, 'password');

    const submit = screen.getByText('Submit');
    expect(submit).toBeEnabled();

    fireEvent.click(submit);
    expect(axios.post).toHaveBeenCalled();
});

test("Input user info unsuccessful", async () => {
    const payload = {data: {user: "testuser", message:"not good"}};
    axios.post.mockResolvedValue(payload);
    render(<MemoryRouter><Login /></MemoryRouter>);
    const element = screen.getByText(/Username/i);
    expect(element).toBeInTheDocument();

    const username = screen.getByPlaceholderText(/username/i);
    await userEvent.type(username, 'testuser');

    const password = screen.getByPlaceholderText(/password/i);
    await userEvent.type(password, 'password');

    const submit = screen.getByText('Submit');
    expect(submit).toBeEnabled();

    fireEvent.click(submit);
    expect(axios.post).toHaveBeenCalled();

    await screen.findByText("Incorrect username or password");
    const incorrect = screen.getByText("Incorrect username or password");
    expect(incorrect).toBeInTheDocument();
});

test("Input user info error", async () => {
    const payload = new Error("test error");
    axios.post.mockRejectedValue(payload);
    render(<MemoryRouter><Login /></MemoryRouter>);
    const element = screen.getByText(/Username/i);
    expect(element).toBeInTheDocument();

    const username = screen.getByPlaceholderText(/username/i);
    await userEvent.type(username, 'testuser');

    const password = screen.getByPlaceholderText(/password/i);
    await userEvent.type(password, 'password');

    const submit = screen.getByText('Submit');
    expect(submit).toBeEnabled();

    fireEvent.click(submit);
    expect(axios.post).toHaveBeenCalled();
});



/**est("renders LoginComp correctly", async () => {
    const originalConsoleLog = console.log;
    console.log = jest.fn();

    const {getByText} = render(<MemoryRouter>< UserInput /></MemoryRouter>);
    await fireEvent.click(getByText('Submit'));
    expect(console.log).toHaveBeenCalled();

    console.log = originalConsoleLog;
});*/