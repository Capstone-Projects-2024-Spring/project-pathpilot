import React from 'react';

const PlanningWelcome = () => {
    return (
        <div className='input-padding'>
            <h1>Welcome to Path Pilot!</h1>
            <h2>How we work:</h2>
            <div>Path Pilot is a Philadelphia based search
                engine meant to assist both tourists and visitos alike in planning a
                day out in the city. Users can select the general types of locations they
                would like to visit, and Path Pilot will find one spot for each selected location
                that are within walking distance of each other. We want to cut down on your
                travelling time and cost by allowing you to stay in oen central location for the day!
            </div>
            <div className='bold-text'>
                <br></br>
                We encourage you to create an account next visit so you can save and access your previously mapped trips!
                <br></br>
                <br></br>
            </div>
            <div>
                The program is randomized so you will likely get different results each time you search
            </div>
        </div>
    )
};

export default PlanningWelcome;