
import { render, screen, fireEvent } from '@testing-library/react';
import PlanManualInput from '../planning/input/PlanManualInput';
import { MemoryRouter } from 'react-router-dom';

test("Plan Manual Input renders successfully", () => {
    render(<PlanManualInput />);
    const element = screen.getByText(/Where would you like to go?/i);
    expect(element).toBeInTheDocument();
});

test("Handle Attribute Change Successful", () => {
    render(<PlanManualInput />);
    const element = screen.getByText(/Where would you like to go?/i);
    expect(element).toBeInTheDocument();
});

test('Check location type attribute selection', () => {
    render(<PlanManualInput />);
    const checkbox = screen.getByLabelText('Coffee Shop');
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
});

test('Check advanced options', async () => {
    const mockUpdateAdvancedOptions = jest.fn();
    const mockUpdateLocations = jest.fn();
    const mockUpdatePoly = jest.fn();

    render(<PlanManualInput updateLocations={mockUpdateLocations} updateAdvancedOptions={mockUpdateAdvancedOptions} updatePoly={mockUpdatePoly}/>);
    const advancedOptions = screen.getByText('Advanced Options');
    expect(advancedOptions).toBeInTheDocument();
    fireEvent.click(advancedOptions);

    const typeElement = screen.getByText('Type of trip');
    expect(typeElement).toBeInTheDocument();

    const attributeElement = screen.getByLabelText('Romantic');
    fireEvent.click(attributeElement);
    expect(attributeElement.checked).toBe(true);

    fireEvent.click(attributeElement);
    expect(attributeElement.checked).toBe(false);

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
    await screen.findByText('1 Star');
    fireEvent.click(screen.getByText('1 Star'));

    const selectStars = screen.getByTestId("stars-select");
    expect(selectStars).toBeInTheDocument();

    fireEvent.keyDown(selectStars.firstChild, { key: 'ArrowDown' });
    await screen.findByText('1 Star');
    fireEvent.click(screen.getByText('1 Star'));


    const minimizeAdvanced = screen.getByText('Minimize Advanced Options');
    fireEvent.click(minimizeAdvanced);
});