import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import HomePage from './home/HomePage.js';
import Login from './login/Login.js'
import Signup from './signup/Signup.js'
import PathPlanning from './planning/PathPlanning.js'
import NavbarBoot from './general/Navbar.jsx';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div>
    <Router>
      <NavbarBoot />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path='/Planning' element={<PathPlanning />} />
      </Routes>
    </Router>
  </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
