
import { render, screen, fireEvent } from '@testing-library/react';
import SavedRoutes from '../savedroutes/SavedRoutes';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

  beforeEach(() => {
    localStorage.removeItem("id");
  });

test("Check saved routes empty list", async () => {
    localStorage.setItem("id",1);
    const payload = {data: []};
    axios.get.mockResolvedValue(payload);
    render(<SavedRoutes />);

    await screen.findByText(/No saved routes found./i);
    const element = screen.getByText(/No saved routes found./i);
    expect(element).toBeInTheDocument();
});

test("Check saved routes locations list", async () => {
    localStorage.setItem("id",1);
    const payload = {data: [[["testname","testaddress"]],[["testname2","testaddress2"]]]};
    axios.get = jest.fn().mockResolvedValue(payload);
    render(<SavedRoutes />);

    await screen.findByText("testname");
    const element = screen.getByText("testname");
    expect(element).toBeInTheDocument();
});

test("Check saved routes error thrown", async () => {
    localStorage.setItem("id",1);
    const payload = new Error("test error");
    axios.get.mockRejectedValue(payload);
    render(<SavedRoutes />);

    await screen.findByText(/Error: /i);
    const element = screen.getByText(/Error: /i);
    expect(element).toBeInTheDocument();
});