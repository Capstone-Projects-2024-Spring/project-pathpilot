import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogContentText } from '@mui/material';
import FetchAIResponse from './FetchAIResponse';
import PulseLoader from 'react-spinners/ClipLoader';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { LocationTypes } from './LocationTypes';
import Box from '@mui/material/Box';
import Select from 'react-select';
import FetchPathCalculation from './FetchPathCalculation';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import makeAnimated from 'react-select/animated';
import { TripAttributes } from './TripAttributes';

const PlanAIInput = ({updateModalState, modalOpen, updateLocations, updateAdvancedOptions, updatePoly, updateAttributeList}) => {
    const [userInput, setUserInput] = useState("");
    const [sentUserInput, setSentUserInput] = useState(false);
    const [aiLoading, setAILoading] = useState(false);
    const [error, setError] = useState(false);
    const [selectedTypeLocations, setSelectedTypeLocations] = useState([]);
    const [suggestedTypes, setSuggestedTypes] = useState([]);
    const [lastSelected, setLastSelected] = useState([]);
    const [open, setOpen] = useState(false)

    //Advanced Options attribtues
    const [advancedOptions, setAdvancedOptions] = useState(false);
    const [selectedAttributes, setSelectedAttributes] = useState([]);
    const [costChoice, setCostChoice] = useState(null);
    const [starsChoice, setStarsChoice] = useState(null);
    const [neighborhoodChoice, setNeighborhoodChoice] = useState(null);
    const [locatedNear, setLocatedNear] = useState(null);

    const animatedComponents = makeAnimated();

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

    const handleAdvanceOptions = () => {
        console.log("Attributes");
        console.log(selectedAttributes);
        if(advancedOptions) {
            setAdvancedOptions(false);
            setSelectedAttributes([]);
            setNeighborhoodChoice(null);
            setCostChoice(null);
            setLocatedNear(null);
        } else {
            setAdvancedOptions(true);
        }
    }

    //Modal close
    const handleClose = (event, reason) => {
        if (reason && (reason === "backdropClick" || reason === "escapeKeyDown") )  {
            return;
        }
        setUserInput("");
        setSentUserInput(false);
        setAILoading(false);
        setError(false);
        setSelectedTypeLocations([]);
        setSuggestedTypes([]);
        setLastSelected([]);
        setOpen(false)
        updateModalState(false)
    } 

    //Send API user input to backend
    const SendUserInputToBackend = async () => {
        try {
            setSentUserInput(true);
            setAILoading(true);
            const suggesedLocationTypes = await FetchAIResponse(userInput);
            console.log(suggesedLocationTypes)
            setAILoading(false);
            if(suggesedLocationTypes.hasOwnProperty("error")) {
                setSentUserInput(false);
                setError(true);
                console.log(0);
                setSelectedTypeLocations([]);
                setOpen(true);
            } else {
                setSuggestedTypes(suggesedLocationTypes.recommendation);
                setSelectedTypeLocations(suggesedLocationTypes.recommendation);
                setLastSelected(suggesedLocationTypes.recommendation)
                setOpen(false);
            }
        } catch {
            console.log("ERROR")
        }
    }

    //Send Path generation input to backend
    const SendManualInputToBackend = async () => {
        try {
            console.log("Attributes");
            console.log(selectedAttributes);
            setAILoading(true);
            setError(false);
            setOpen(false);
            const pathData = await FetchPathCalculation(selectedTypeLocations, selectedAttributes, costChoice, starsChoice, neighborhoodChoice, locatedNear);
            //pathData.locations ? setLocations(pathData.locations) : console.log("ERROR");
            //pathData.path ? setPath(pathData.path) : console.log("ERROR");
            //console.log(JSON.parse(pathData.route[0][9]));
            if(pathData.hasOwnProperty("error")) {
                setAILoading(false);
                setError(true);
                setOpen(true);
                setLastSelected(selectedTypeLocations);
                console.log("error here");
            } else {
                setAILoading(false);
                console.log(JSON.parse(pathData.route[0][9]));
                pathData ? updateLocations(pathData.route) : console.log("ERROR");
                pathData ? updatePoly(pathData.polyline) : console.log("ERROR");
                pathData ? updateAttributeList(selectedAttributes) : console.log("ERROR");     
                handleClose();       
            }

            //pathData.locations ? updateLocations(pathData.locations) : console.log("ERROR");
            //pathData.path ? updatePath(pathData.path) : console.log("ERROR");
        } catch {
            console.log("ERROR")
        }
    }

    useEffect(() => {
        console.log(modalOpen);
        console.log("Why aren't you loading");
    }, [modalOpen]);

    useEffect(() => {
        console.log(selectedTypeLocations);
        console.log("selected types");
        selectedTypeLocations?.map((type) => {
            console.log(typeof(type))
        })
    }, [selectedTypeLocations]);

    const handleTypeChange = (e) => {
        if(e.target.checked) {
            setSelectedTypeLocations(selectedTypeLocations => [...selectedTypeLocations, parseInt(e.target.value)]);
        } else {
            const index = selectedTypeLocations.indexOf(parseInt(e.target.value));
            console.log(typeof(e.target.value))
            console.log(index);
            setSelectedTypeLocations(selectedTypeLocations => selectedTypeLocations.filter((_,i) => i !== index));
        }
        console.log(selectedTypeLocations);
    }

    return (
        <div>
            <Dialog onClose={handleClose} open={modalOpen} fullWidth maxWidth="sm">
                <DialogTitle>How do you want spend your day?</DialogTitle>
                { !aiLoading ?
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton> : <div></div>}
        <DialogContent>
          <DialogContentText>
          Not sure what you want to do in Philadelphia? Write down how you
            want to generally spend your day and let us suggest location types to visit!
          </DialogContentText>
          <br></br>
          {!sentUserInput ?
          <div>
          <DialogContentText>
            <b>Try prompts like:</b>
            <br></br>
            <i>I want to spend a relaxing day in the city.</i>
            <br></br>
            <i>I want to hang out with my kids.</i>
          </DialogContentText>
          <br></br>
          <textarea onChange = {e => setUserInput(e.target.value)} placeholder='Input description here' className='user-input-for-AI'></textarea>
          {!aiLoading && !sentUserInput && error  ?
            <div className='error-container'>
            <br></br>
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
                    Error occurred, please try again with a different trip description
                    </Alert>
                </Collapse>
            </div>: <div></div> }
          <div className='submit-button-container'>
          <button disabled={userInput.length === 0} onClick={SendUserInputToBackend} className='submit-button'>Submit</button></div>
          </div>: <div></div>}
          {!aiLoading && sentUserInput ?
          <div>
            <DialogContentText>
                <b>Try these location types!</b>
                <br></br>
                Add or remove any types then press submit to get your suggested path
                <br></br>
                <br></br>
            </DialogContentText>
            <Box sx={ {display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gridGap: '1em'} }>
            {
                LocationTypes?.map((type) =>
                <div className='checkboxes-for-locations'>
                    {
                        lastSelected?.includes(type.value) ? <FormControlLabel control={<Checkbox defaultChecked value={type.value} onChange={handleTypeChange}/>} label={type.label} />
                        : <FormControlLabel control={<Checkbox value={type.value} onChange={handleTypeChange}/>} label={type.label} />
                    }
                </div>
                )
            }
            </Box>

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
                  </div> : <div></div>
        }
        {aiLoading ? 
            <div className='loading-container'>
                <div className='loading-text'>Loading</div>
                    <PulseLoader
                        color="#36d7b7"
                        speedMultiplier={0.5}
                        loading={aiLoading}
                    />
                </div> : <div></div>}

        {!aiLoading && sentUserInput && error  ?
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
            </div>: <div></div> }

        {selectedTypeLocations?.length > 10 ? <div className='too-long-conatiner'><Alert severity='warning'>Can only choose max 10 location types</Alert></div> : <div></div>}

        {!aiLoading && sentUserInput ?
        <div className='submit-button-container'>
            <button disabled={aiLoading || selectedTypeLocations?.length === 0 || selectedTypeLocations?.length > 10} className='submit-button' onClick={SendManualInputToBackend}>Submit</button>
        </div> : <div></div> }
        </DialogContent>
            </Dialog>
        </div>
    );
};

export default PlanAIInput;