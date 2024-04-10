import React from 'react';
import SignupInput from './SignupInput.jsx'
import SignupWelcome from './SignupWelcome.jsx';

const Signup = () => {
    return(
        <div className='signup-main'>
        <div className="signup-parent-container">
            <div className='signup-parent'>
                <SignupWelcome />
                <SignupInput />
            </div>
        </div>
        </div>
    );
};

export default Signup;