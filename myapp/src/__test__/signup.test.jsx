
import { render, screen, fireEvent, act } from '@testing-library/react';
import Signup from '../signup/Signup';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

jest.mock('axios');

test("Signup page renders successfully", () => {
    render(<MemoryRouter><Signup /></MemoryRouter>);
    const element = screen.getByAltText("Path Pilot Logo");
    expect(element).toBeInTheDocument();

    const element2 = screen.getByPlaceholderText(/username/i);
    expect(element2).toBeInTheDocument();
});

test("Input user info success", async () => {
    const payload = {data: {message: "success"}};
    axios.post.mockResolvedValue(payload);
    render(<MemoryRouter><Signup /></MemoryRouter>);
    const element = screen.getByText(/Username/i);
    expect(element).toBeInTheDocument();

    const email = screen.getByPlaceholderText(/email/i);
    await userEvent.type(email, 'testemail');

    const username = screen.getByPlaceholderText(/username/i);
    await userEvent.type(username, 'testuser');

    const password = screen.getByPlaceholderText("Password");
    await userEvent.type(password, 'password');

    const confirmPassword = screen.getByPlaceholderText("Confirm Password");
    await userEvent.type(confirmPassword, 'password');

    const submit = screen.getByText('Submit');
    expect(submit).toBeEnabled();

    fireEvent.click(submit);
    expect(axios.post).toHaveBeenCalled();

    await screen.findByText("Successful Signup");
    const success = screen.getByText("Successful Signup");
    expect(success).toBeInTheDocument();
});

test("Input user info unsuccessful", async () => {
    const payload = {data: {message: "error test"}};
    axios.post.mockResolvedValue(payload);
    render(<MemoryRouter><Signup /></MemoryRouter>);
    const element = screen.getByText(/Username/i);
    expect(element).toBeInTheDocument();

    const email = screen.getByPlaceholderText(/email/i);
    await userEvent.type(email, 'testemail');

    const username = screen.getByPlaceholderText(/username/i);
    await userEvent.type(username, 'testuser');

    const password = screen.getByPlaceholderText("Password");
    await userEvent.type(password, 'password');

    const confirmPassword = screen.getByPlaceholderText("Confirm Password");
    await userEvent.type(confirmPassword, 'password');

    const submit = screen.getByText('Submit');
    expect(submit).toBeEnabled();

    fireEvent.click(submit);
    expect(axios.post).toHaveBeenCalled();

    await screen.findByText("error test");
    const fail = screen.getByText("error test");
    expect(fail).toBeInTheDocument();
});

test("Input user info error", async () => {
    const payload = new Error("test error");
    axios.post.mockRejectedValue(payload);
    render(<MemoryRouter><Signup /></MemoryRouter>);
    const element = screen.getByText(/Username/i);
    expect(element).toBeInTheDocument();

    const email = screen.getByPlaceholderText(/email/i);
    await userEvent.type(email, 'testemail');

    const username = screen.getByPlaceholderText(/username/i);
    await userEvent.type(username, 'testuser');

    const password = screen.getByPlaceholderText("Password");
    await userEvent.type(password, 'password');

    const confirmPassword = screen.getByPlaceholderText("Confirm Password");
    await userEvent.type(confirmPassword, 'password');

    const submit = screen.getByText('Submit');
    expect(submit).toBeEnabled();

    fireEvent.click(submit);
    expect(axios.post).toHaveBeenCalled();
});