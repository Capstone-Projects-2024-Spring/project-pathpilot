import React from 'react';
import {useState} from 'react';
import PlanMapOutput from './output/PlanMapOutput'; 
import PlanListOutput from './output/PlanListOutput';
import PlanManualInput from './input/PlanManualInput';
import PlanningWelcome from './PlanningWelcome';
import './PathPlanning.css';
import LoginWelcomeAuthenticated from './LoginWelcomAuthenticated';

const Parent = () => {
    const [locations, setLocations] = useState(null);
    const [includeAdvancedOptions, setIncludeAdvancedOptions] = useState(false);
    const [poly, setPoly] = useState(null);

    /**
     * Updates the locations
     * @param {List} newLocations - The new list of  locations
     */
    const updateLocations = (newLocations) => {
        console.log("locations" + newLocations);
        setLocations(newLocations);
    }
    console.log(locations?.length);

    const updateAdvancedOptions = (advancedOptions) => {
        setIncludeAdvancedOptions(advancedOptions);
        console.log("test");
    }

    const updatePoly = (polyline) => {
        setPoly(polyline);
        console.log("polyline in parent");
        console.log(polyline);
    }

    return (
        <div className='main-component'>
            <div className='output'>
                <PlanMapOutput locations={locations} poly={poly}/>
            </div>
            <div className='input'>
            {
                locations ? <div>
                                <PlanListOutput locations={locations} updateLocations={updateLocations} updateAdvancedOptions={updateAdvancedOptions} />
                            </div> :
                <><PlanManualInput updateLocations={updateLocations} updateAdvancedOptions={updateAdvancedOptions} updatePoly={updatePoly}/>
                    {includeAdvancedOptions ? <div></div> :
                        <div>
                            <hr></hr>
                            {
                                localStorage.getItem("username") ? <LoginWelcomeAuthenticated /> : <PlanningWelcome />
                            }
                        </div>
                    }
                </>
            }
            </div>
        </div>
    )

};

export default Parent;