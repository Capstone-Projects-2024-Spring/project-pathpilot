import React, {useState, useEffect} from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {LocationTypes} from './LocationTypes.js';
import {TripAttributes} from './TripAttributes.js';
import FetchPathCalculation from './FetchPathCalculation.js';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import PulseLoader from 'react-spinners/ClipLoader';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import PlanAIInput from './PlanAIInput.jsx';
import Box from '@mui/material/Box';

const PlanManualInput = ({ updateLocations, updateAdvancedOptions, updatePoly, updateAttributeList }) => {
    const [selectedTypeLocations, setSelectedTypeLocations] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState([]);
    const [costChoice, setCostChoice] = useState(null);
    const [starsChoice, setStarsChoice] = useState(null);
    const [neighborhoodChoice, setNeighborhoodChoice] = useState(null);
    const [locatedNear, setLocatedNear] = useState(null);
    const [error, setError] = useState(false);
    const [advancedOptions, setAdvancedOptions] = useState(false);
    const [open, setOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(false)

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

    // Ensure this is in sync with zip_code_mapping in PathController.py
    const neighborhoods = [
        { value: 1, label: 'Bella Vista / Queens Village / Pennsport' },
        // 19147
        { value: 2, label: 'Fishtown / Callowhill / Northern Liberties' },
        // 19125, 19123
        { value: 3, label: 'Fairmount / Spring Garden' },
        // 19130
        { value: 4, label: 'Rittenhouse Square / Logan Square' },
        // 19102, 19103, 19146
        { value: 5, label: 'Chinatown / Old City' },
        // 19107, 19106
        { value: 6, label: 'North Broad' },
        // 19121, 19132
        { value: 7, label: 'Spruce Hill / Cedar Park / Point Breeze' },
        // 19104, 19146
    ];

    const locatedNearLocations = [
        { value: 'bsl', label: 'BSL Subway Stop'},
        { value: 'msl', label: 'MSL Subway Stop'},
        { value: 'bus', label: 'Bus Stop'},
        { value: 'parking', label: 'Parking Garage'},
        { value: 'trolley', label: 'Trolley Stop'},
        { value: 'regional rail', label: 'Regional Rail Station'}
    ];

    const updateModalState = () => {
        setModalOpen(!modalOpen);
    }

    const handleTypeChange = (e) => {
        if(e.target.checked) {
            setSelectedTypeLocations(selectedTypeLocations => [...selectedTypeLocations, e.target.value]);
        } else {
            const index = selectedTypeLocations.indexOf(e.target.value);
            setSelectedTypeLocations(selectedTypeLocations => selectedTypeLocations.filter((_,i) => i !== index));
        }
        console.log(selectedTypeLocations);
    }

    //Next three useEffects are for testing purposes
    useEffect(() => {
        console.log(selectedTypeLocations);
        console.log(selectedTypeLocations.length)
    }, [selectedTypeLocations]);

    useEffect(() => {
        console.log(neighborhoodChoice);
    }, [neighborhoodChoice]);

    useEffect(() => {
        console.log(selectedAttributes);
        console.log(selectedAttributes.length)
    }, [selectedAttributes]);

    const handleAdvanceOptions = () => {
        console.log("Attributes");
        console.log(selectedAttributes);
        if(advancedOptions) {
            setAdvancedOptions(false);
            updateAdvancedOptions(false);
            setSelectedAttributes([]);
            setNeighborhoodChoice(null);
            setCostChoice(null);
            setLocatedNear(null);
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
            setError(false);
            const pathData = await FetchPathCalculation(selectedTypeLocations, selectedAttributes, costChoice, starsChoice, neighborhoodChoice, locatedNear);
            //pathData.locations ? setLocations(pathData.locations) : console.log("ERROR");
            //pathData.path ? setPath(pathData.path) : console.log("ERROR");
            //console.log(JSON.parse(pathData.route[0][9]));
            if(pathData.hasOwnProperty("error")) {
                setLoading(false);
                setError(true);
                setOpen(true);
                console.log("error here");
            } else {
                setLoading(false);
                console.log(JSON.parse(pathData.route[0][9]));
                pathData ? setLocations(pathData.route) : console.log("ERROR");
                pathData ? updateLocations(pathData.route) : console.log("ERROR");
                pathData ? updatePoly(pathData.polyline) : console.log("ERROR");
                pathData ? updateAttributeList(selectedAttributes) : console.log("ERROR");            
            }

            //pathData.locations ? updateLocations(pathData.locations) : console.log("ERROR");
            //pathData.path ? updatePath(pathData.path) : console.log("ERROR");
        } catch {
            console.log("ERROR")
        }
    }

    const handleModalOpen = () => {
        setModalOpen(true);
        console.log("in here modal");
    }
 

    useEffect(() => {
        console.log(modalOpen);
    }, [modalOpen]);
    //console.log("locations = ", locations);
    //console.log("path = ", path);

    
    return (
        <div className='input-padding'>
            <h2>Where would you like to go?</h2>
            <div className='location-type-selection'>
            <Box sx={ {display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gridGap: '1em'} }>
            {
                LocationTypes?.map((type) =>
                <div>
                    <FormControlLabel control={<Checkbox value={type.value} onChange={handleTypeChange}/>} label={type.label} />
                    {
                        //console.log("Value " + selectedTypeLocations)
                    }
                </div>
                )
            }
            </Box>
            </div>

            {
                advancedOptions ? 
                    <div>
                        <br></br>
                        <div className='advanced-options-title' onClick={handleAdvanceOptions}>Minimize Advanced Options</div>
                        <h3>Preferred Location Requirements</h3>
                        <div className='select-container'>
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
                        <div className='select-container'>
                            <h3>Cost of Locations</h3>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={choice => choice === null ? setCostChoice(null) : setCostChoice(choice.value)}
                                options={cost}
                                isClearable={true}
                                placeholder="Select Cost..."
                            />
                        </div>
                        <div className='select-container'>
                            <h3>Minimum Number of Stars</h3>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={choice => choice === null ? setStarsChoice(null) : setStarsChoice(choice.value)}
                                options={stars}
                                isClearable={true}
                                placeholder="Select Stars..."
                            />
                        </div>
                        <div className='select-container'>
                            <h3>Preferred Neighborhood</h3>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                onChange={choice => choice === null ? setNeighborhoodChoice(null) : setNeighborhoodChoice(choice.value)}
                                options={neighborhoods}
                                isClearable={true}
                                placeholder="Select Neighborhood..."
                            />
                        </div>
                        <div className='select-container'>
                            <h3>Located Near A</h3>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                isClearable={true}
                                onChange={choice => choice === null ? setLocatedNear(null) : setLocatedNear(choice.value)}
                                options={locatedNearLocations}
                                placeholder="Select Locations..."
                            />
                        </div>
                    </div>
                : <div className='advanced-options-title' onClick={handleAdvanceOptions}>Advanced Options</div>
            }
            <br></br>

            {loading ?
                <div className='loading-container'>
                    <div className='loading-text'>Loading</div>
                    <PulseLoader
                        color="#36d7b7"
                        speedMultiplier={0.5}
                        loading={loading}
                    />
                </div> : <div></div>
            }
            {error ?  
                <div className='error-container'>
                    <Collapse in={open}>
                        <Alert
                        action={
                            <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                            >
                            <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        severity='error'
                        sx={{ mb: 2 }}
                        >
                        Error occurred, please try again with a different set of trip requirements
                        </Alert>
                    </Collapse>
                </div>: <div></div>}
            
            {selectedTypeLocations.length > 10 ? <div className='too-long-conatiner'><Alert severity='warning'>Can only choose max 10 location types</Alert></div> : <div></div>}

            <div className='submit-button-container'>
                <button disabled={loading || selectedTypeLocations.length === 0 || selectedTypeLocations.length > 10} className='submit-button' onClick={SendManualInputToBackend}>Submit</button>
            </div>
            <div className='ai-click-holder'>Need some extra inspiration?
            <button disabled={loading} className='ai-click' onClick={handleModalOpen}>Try our *AI powered* planning functionality</button>
            </div>
            <PlanAIInput updateModalState={updateModalState} modalOpen={modalOpen} updateLocations={updateLocations} updateAdvancedOptions={updateAdvancedOptions} updatePoly={updatePoly} updateAttributeList={updateAttributeList} />
        </div>
    )
};

export default PlanManualInput;