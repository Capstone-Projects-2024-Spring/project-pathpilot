import React from 'react';
import {useState} from 'react';
import PlanMapOutput from './output/PlanMapOutput'; 
import PlanListOutput from './output/PlanListOutput';
import PlanManualInput from './input/PlanManualInput';
import PlanningWelcome from './PlanningWelcome';
import './PathPlanning.css';

const Parent = () => {
    const [locations, setLocations] = useState(null);
    const [path, setPath] = useState(null);
    const [includeAdvancedOptions, setIncludeAdvancedOptions] = useState(false);

    /**
     * Updates the path
     * @param {String} newPath - The new path code
     */
    const updatePath = (newPath) => {
        setPath(newPath);
    }

    /**
     * Updates the locations
     * @param {List} newLocations - The new list of  locations
     */
    const updateLocations = (newLocations) => {
        setLocations(newLocations);
    }
    console.log(locations?.length);

    const updateAdvancedOptions = (advancedOptions) => {
        setIncludeAdvancedOptions(advancedOptions);
        console.log("test");
    }

    return (
        <div className='main-component'>
            <div className='output'>
                <PlanMapOutput locations={locations} path={path}/>
            </div>
            <div className='input'>
            {
                locations ? <div>
                                <PlanListOutput locations={locations} updateLocations={updateLocations} updateAdvancedOptions={updateAdvancedOptions} />
                            </div> :
                <><PlanManualInput updateLocations={updateLocations} updatePath={updatePath} updateAdvancedOptions={updateAdvancedOptions}/>
                    {includeAdvancedOptions ? <div></div> :
                        <div>
                            <hr></hr>
                            <PlanningWelcome />
                        </div>
                    }
                </>
            }
            </div>
        </div>
    )

};

export default Parent;