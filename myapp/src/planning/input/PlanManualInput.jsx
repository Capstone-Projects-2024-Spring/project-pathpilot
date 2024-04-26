import React, {useState} from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {LocationTypes} from './LocationTypes.js';
import {TripAttributes} from './TripAttributes.js';
import FetchPathCalculation from './FetchPathCalculation.js';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const PlanManualInput = ({ updateLocations, updateAdvancedOptions, updatePoly, updateAttributeList }) => {
    const [selectedTypeLocations, setSelectedTypeLocations] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState([]);
    const [costChoice, setCostChoice] = useState(null);
    const [starsChoice, setStarsChoice] = useState(null);
    const [neighborhoodChoice, setNeighborhoodChoice] = useState(null);
    const [locatedNear, setLocatedNear] = useState(null);

    const [advancedOptions, setAdvancedOptions] = useState(false);

    const animatedComponents = makeAnimated();


    //Get rid of these eventually
    const [path, setPath] = useState(null);
    const [locations, setLocations] = useState(null);
    const [loading, setLoading] = useState(false);

    //For select options
    const cost = [
        { value: '$', label: '$' },
        { value: '$$', label: '$$' },
        { value: '$$$', label: '$$$' }
    ];

    const stars = [
        { value: 1, label: '1 Star' },
        { value: 2, label: '2 Stars' },
        { value: 3, label: '3 Stars' },
        { value: 4, label: '4 Stars' },
        { value: 5, label: '5 Stars' }
    ];

    const neighborhoods = [
        { value: 'bella vista', label: 'Bella Vista' },
        { value: 'callowhill', label: 'Callowhill' },
        { value: 'chinatown', label: 'Chinatown' },
        { value: 'east passyunk', label: 'East Passyunk' },
        { value: 'fairhill', label: 'Fairhill' },
        { value: 'fairmount', label: 'Fairmount' },
        { value: 'fishtown', label: 'Fishtown' },
        { value: 'graduate hospital', label: 'Graduate Hospital' },
        { value: 'logan square', label: 'Logan Square' },
        { value: 'market east', label: 'Market East' },
        { value: 'midtown village', label: 'Midtown Village' },
        { value: 'northern liberties', label: 'Northern Liberties' },
        { value: 'old city', label: 'Old City' },
        { value: 'pennsport', label: 'Pennsport' },
        { value: 'powelton village', label: 'Powelton Village' },
        { value: 'queen village', label: 'Queen Village' },
        { value: 'rittenhouse square', label: 'Rittenhouse Square' },
        { value: 'society hill', label: 'Society Hill' },
        { value: 'spring garden', label: 'Spring Garden' },
        { value: 'spruce hill and cedar park', label: 'Spruce Hill and Cedar Park' },
        { value: 'university city', label: 'University City' },
        { value: 'washington square west', label: 'Washington Square West' },
        { value: 'north broad', label: 'North Broad'}
    ];

    const locatedNearLocations = [
        { value: 'bsl', label: 'BSL Subway Stop'},
        { value: 'msl', label: 'MSL Subway Stop'},
        { value: 'bus', label: 'Bus Stop'},
        { value: 'parking', label: 'Parking Garage'},
        { value: 'trolley', label: 'Trolley Stop'},
        { value: 'regional rail', label: 'Regional Rail Station'}
    ];

    const handleTypeChange = (e) => {
        if(e.target.checked) {
            setSelectedTypeLocations(selectedTypeLocations => [...selectedTypeLocations, e.target.value]);
        } else {
            const index = selectedTypeLocations.indexOf(e.target.value);
            selectedTypeLocations.splice(index,1);
            //console.log(selectedTypeLocations);
        }
    }

    const handleAdvanceOptions = () => {
        console.log("Attributes");
        console.log(selectedAttributes);
        if(advancedOptions) {
            setAdvancedOptions(false);
            updateAdvancedOptions(false);
        } else {
            setAdvancedOptions(true);
            updateAdvancedOptions(true);
        }
    }

    const SendManualInputToBackend = async () => {
        try {
            console.log("Attributes");
            console.log(selectedAttributes);
            setLoading(true);
            const pathData = await FetchPathCalculation(selectedTypeLocations, selectedAttributes, costChoice, starsChoice, neighborhoodChoice, locatedNear);
            //pathData.locations ? setLocations(pathData.locations) : console.log("ERROR");
            //pathData.path ? setPath(pathData.path) : console.log("ERROR");
            //console.log(JSON.parse(pathData.route[0][9]));
            setLoading(false);
            console.log(JSON.parse(pathData.route[0][9]));
            pathData ? setLocations(pathData.route) : console.log("ERROR");
            pathData ? updateLocations(pathData.route) : console.log("ERROR");
            pathData ? updatePoly(pathData.polyline) : console.log("ERROR");
            pathData ? updateAttributeList(selectedAttributes) : console.log("ERROR");
            //pathData.locations ? updateLocations(pathData.locations) : console.log("ERROR");
            //pathData.path ? updatePath(pathData.path) : console.log("ERROR");
        } catch {
            console.log("ERROR")
        }
    }
    //console.log("locations = ", locations);
    //console.log("path = ", path);

    
    return (
        <div className='input-padding'>
            <h2>Where would you like to go?</h2>
            <FormGroup>
            {
                LocationTypes?.map((type) =>
                <div>
                    <FormControlLabel data-testid='type-check' control={<Checkbox value={type.value} onChange={handleTypeChange}/>} label={type.label} />
                    {
                        //console.log("Value " + selectedTypeLocations)
                    }
                </div>
                )
            }
            </FormGroup>

            {
                advancedOptions ? 
                    <div>
                        <br></br>
                        <div className='advanced-options-title' onClick={handleAdvanceOptions}>Minimize Advanced Options</div>
                        <h3>Type of trip</h3>
                        <div data-testid="attribute-select">
                        <Select
                            isMulti
                            name="colors"
                            options={TripAttributes}
                            components={animatedComponents}
                            onChange={choice => setSelectedAttributes(choice)}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                        </div>
                        <h3>Cost of Locations</h3>
                        <div data-testid="cost-select">
                            <Select
                                className='input-option-select'
                                onChange={choice => setCostChoice(choice.value)}
                                options={cost}
                                placeholder="Select Cost..."
                            />
                        </div>
            
                        <h3>Minimum Number of Stars</h3>
                        <div data-testid="stars-select">
                            <Select
                                className='input-option-select'
                                onChange={choice => setStarsChoice(choice.value)}
                                options={stars}
                                placeholder="Select Stars..."
                            />
                        </div>
            
                        <h3>Preferred Neighborhood</h3>
                        <div data-testid="neighborhood-select">
                            <Select
                                className='input-option-select'
                                onChange={choice => setNeighborhoodChoice(choice.value)}
                                options={neighborhoods}
                                placeholder="Select Neighborhood..."
                            />
                        </div>
            
                        <h3>Located Near A</h3>
                        <div data-testid="locatednear-select">
                            <Select
                                className='input-option-select'
                                onChange={choice => setLocatedNear(choice.value)}
                                options={locatedNearLocations}
                                placeholder="Select Locations..."
                            />
                        </div>
                    </div>
                : <div className='advanced-options-title' onClick={handleAdvanceOptions}>Advanced Options</div>
            }
            <br></br>
            <div className='submit-button-container'>
                <button disabled={loading || selectedTypeLocations.length === 0} className='submit-button' onClick={SendManualInputToBackend}>Submit</button>
            </div>
        </div>
    )
};

export default PlanManualInput;