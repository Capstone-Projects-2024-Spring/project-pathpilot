
import { render, screen, fireEvent } from '@testing-library/react';
import PlanListOutput from '../planning/output/PlanListOutput';
import { MemoryRouter } from 'react-router-dom';

test("List output renders successfully with locations", () => {
    const mockUpdateLocations = jest.fn();
    const mockUpdateAdvancedOptions = jest.fn();
    const mockLocations = [[604, 'Nom Wah Philadelphia', '19107', 39.9565775, -75.1606101, '218 N 13th St Philadelphia, PA 19107', '["Mon", "11:30 AM - 8:30 PM", "Tue", "Closed", "Wed", "11:30 AM - 8:30 PM", "Thu", "11:30 AM - 8:30 PM", "Fri", "11:30 AM - 8:30 PM", "Sat", "11:30 AM - 8:30 PM", "Sun", "11:30 AM - 8:30 PM"]', 4.0, 2, '["Accepts Credit Cards", "Classy", "Moderate Noise", "Good for Groups", "Good For Kids", "Free Wi-Fi", "No Outdoor Seating"]', '$$ '], [195, 'Buena Onda', '19130', 39.960382100000004, -75.17068620608734, '1901 Callowhill St Philadelphia, PA 19130', '["Mon", "11:00 AM - 8:00 PM", "Tue", "11:00 AM - 8:00 PM", "Wed", "11:00 AM - 8:00 PM", "Thu", "11:00 AM - 8:00 PM", "Fri", "11:00 AM - 8:00 PM", "Sat", "11:00 AM - 8:00 PM", "Sun", "11:00 AM - 8:00 PM"]', 4.0, 1, '["Outdoor Seating", "Casual", "Good for Groups", "Good For Kids", "Happy Hour Specials"]', '$$ ']];
    render(<PlanListOutput locations={mockLocations} updateLocations={mockUpdateLocations} updateAdvancedOptions={mockUpdateAdvancedOptions} />);

    const element = screen.getByText(/Start Over/i);
    expect(element).toBeInTheDocument();
    fireEvent.click(element);
});

test("List output renders successfully without locations", () => {
    const mockUpdateLocations = jest.fn();
    const mockUpdateAdvancedOptions = jest.fn();
    render(<PlanListOutput locations={null} updateLocations={mockUpdateLocations} updateAdvancedOptions={mockUpdateAdvancedOptions} />);

    const element = screen.getByText(/Start Over/i);
    expect(element).toBeInTheDocument();
});

test("List output renders successfully with -1", () => {
    const mockUpdateLocations = jest.fn();
    const mockUpdateAdvancedOptions = jest.fn();
    const mockLocations = [[604, 'Nom Wah Philadelphia', '19107', 39.9565775, -75.1606101, '218 N 13th St Philadelphia, PA 19107', '["Mon", "11:30 AM - 8:30 PM", "Tue", "Closed", "Wed", "11:30 AM - 8:30 PM", "Thu", "11:30 AM - 8:30 PM", "Fri", "11:30 AM - 8:30 PM", "Sat", "11:30 AM - 8:30 PM", "Sun", "11:30 AM - 8:30 PM"]', -1, 2, '[-1]', "-1"]];
    render(<PlanListOutput locations={mockLocations} updateLocations={mockUpdateLocations} updateAdvancedOptions={mockUpdateAdvancedOptions} />);

    
    const element = screen.getByText(/Start Over/i);
    expect(element).toBeInTheDocument();
});