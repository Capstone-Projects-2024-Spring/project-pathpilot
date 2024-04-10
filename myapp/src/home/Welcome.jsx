import React from 'react';
import PathPilotLogo from './PathPilotLogo.png';
import PathPilotAnimated from './PathPilotAnimated.GIF'
import './Welcome.css';
import { Link } from 'react-router-dom';

const Welcome = () => {
    return (
        <div>
            <div className='main-welcome-component'>
                <img src={PathPilotAnimated} alt="Path Pilot Logo" className='logo'></img>
            </div>
                <div className='welcome-text-header'>Sit back, relax, and get ready to soar into your next Philly outing.</div>
                <div className='welcome-text'>Planning a day trip in Philadelphia with Path Pilot is like having your own personal
                    travel assistant. Pick what you want to do, what you want your trip to be like, and let Path Pilot do the work.
                    Taking a trip will be a walk in the park.
                </div>
            <div className='get-started'>
                <div className='get-started-text'>Get Started Now</div>
                <div className='redirect-button-container'>
                    <Link className='redirect-button' to='/login'><button className='redirect-button'>Login</button></Link>
                    <Link className='redirect-button' to='/signup'><button className='redirect-button'>Sign Up</button></Link>
                </div>
                <div className='guest-link-container'>
                    <Link className='guest-link' to='/planning'>Or Continue as a Guest</Link>
                </div>
            </div>
        </div>
    );
};

export default Welcome;