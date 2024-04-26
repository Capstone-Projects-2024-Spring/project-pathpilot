import { render, screen, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import PathPlanning from '../planning/PathPlanning';
import PlanMapOutput from '../planning/output/PlanMapOutput';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock("../planning/output/PlanMapOutput", () => {
    return ({PlanMapOutput}) => <div></div>;
  });

jest.mock('axios');

  beforeEach(() => {
    localStorage.removeItem("username");
  });

test("planning page renders successfully", () => {
    render(<PathPlanning />);

    const welcome = screen.getByText("Welcome to Path Pilot!");
    expect(welcome).toBeInTheDocument();
});

test("planning page renders successfully for authenticated user", () => {
    localStorage.setItem("username","testuser");
    render(<PathPlanning />);

    const welcome = screen.getByText(/Welcome back/i);
    expect(welcome).toBeInTheDocument();
});

test('Check location type attribute selection', () => {

    render(<PathPlanning/>);
    const checkbox = screen.getByLabelText('Coffee Shop');
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
});


test('Check send manual input to backend functional call (works)', async () => {
    const payload = {data: {route: [[604, 'Nom Wah Philadelphia', '19107', 39.9565775, -75.1606101, '218 N 13th St Philadelphia, PA 19107', '["Mon", "11:30 AM - 8:30 PM", "Tue", "Closed", "Wed", "11:30 AM - 8:30 PM", "Thu", "11:30 AM - 8:30 PM", "Fri", "11:30 AM - 8:30 PM", "Sat", "11:30 AM - 8:30 PM", "Sun", "11:30 AM - 8:30 PM"]', 4.0, 2, '["Accepts Credit Cards", "Classy", "Moderate Noise", "Good for Groups", "Good For Kids", "Free Wi-Fi", "No Outdoor Seating"]', '$$ '], [195, 'Buena Onda', '19130', 39.960382100000004, -75.17068620608734, '1901 Callowhill St Philadelphia, PA 19130', '["Mon", "11:00 AM - 8:00 PM", "Tue", "11:00 AM - 8:00 PM", "Wed", "11:00 AM - 8:00 PM", "Thu", "11:00 AM - 8:00 PM", "Fri", "11:00 AM - 8:00 PM", "Sat", "11:00 AM - 8:00 PM", "Sun", "11:00 AM - 8:00 PM"]', 4.0, 1, '["Outdoor Seating", "Casual", "Good for Groups", "Good For Kids", "Happy Hour Specials"]', '$$ ']], polyline: "1234"}};
    axios.post.mockResolvedValue(payload);

    render(<PathPlanning/>);
    const checkbox = screen.getByLabelText('Coffee Shop');
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    const submit = screen.getByText('Submit');
    expect(submit).toBeEnabled()

    fireEvent.click(submit);
    
    
    expect(axios.post).toHaveBeenCalled();

    await screen.findByText("Start Over");
    const element = screen.getByText("Start Over");
    expect(element).toBeInTheDocument();

});

test('Check advanced options', async () => {

    render(<PathPlanning />);
    const advancedOptions = screen.getByText('Advanced Options');
    expect(advancedOptions).toBeInTheDocument();
    fireEvent.click(advancedOptions);

    const typeElement = screen.getByText('Type of trip');
    expect(typeElement).toBeInTheDocument();

    const selectAttributes = screen.getByTestId("attribute-select");
    expect(selectAttributes).toBeInTheDocument();

    fireEvent.keyDown(selectAttributes.firstChild, { key: 'ArrowDown' });
    await screen.findByText('Adults-Only');
    fireEvent.click(screen.getByText('Adults-Only'));

    const selectCost = screen.getByTestId("cost-select");
    expect(selectCost).toBeInTheDocument();

    fireEvent.keyDown(selectCost.firstChild, { key: 'ArrowDown' });
    await screen.findByText('$');
    fireEvent.click(screen.getByText('$'));

    const selectStars = screen.getByTestId("stars-select");
    expect(selectStars).toBeInTheDocument();

    fireEvent.keyDown(selectStars.firstChild, { key: 'ArrowDown' });
    await screen.findByText('1 Star');
    fireEvent.click(screen.getByText('1 Star'));

    const selectNeighborhood = screen.getByTestId("neighborhood-select");
    expect(selectNeighborhood).toBeInTheDocument();

    fireEvent.keyDown(selectNeighborhood.firstChild, { key: 'ArrowDown' });
    await screen.findByText('Bella Vista');
    fireEvent.click(screen.getByText('Bella Vista'));

    const selectLocatedNear = screen.getByTestId("locatednear-select");
    expect(selectLocatedNear).toBeInTheDocument();

    fireEvent.keyDown(selectLocatedNear.firstChild, { key: 'ArrowDown' });
    await screen.findByText('BSL Subway Stop');
    fireEvent.click(screen.getByText('BSL Subway Stop'));


    const minimizeAdvanced = screen.getByText('Minimize Advanced Options');
    fireEvent.click(minimizeAdvanced);
    expect(advancedOptions).toBeInTheDocument();
});

test('Check send manual input to backend functional call (does not work)', async () => {
    const payload = new Error("test bad request");
    axios.post.mockResolvedValue(payload);

    render(<PathPlanning/>);
    const checkbox = screen.getByLabelText('Coffee Shop');
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    const submit = screen.getByText('Submit');
    expect(submit).toBeEnabled()

    fireEvent.click(submit);
    
    
    expect(axios.post).toHaveBeenCalled();

});
