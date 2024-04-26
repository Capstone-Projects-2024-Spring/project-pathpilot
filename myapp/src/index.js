import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import HomePage from './home/HomePage.js';
import Login from './login/Login.js'
import Signup from './signup/Signup.js'
import PathPlanning from './planning/PathPlanning.js'
import SavedRoutes from './savedroutes/SavedRoutes.js'
import NavbarBoot from './general/Navbar.jsx';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

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
        <Route path='/SavedRoutes' element={<SavedRoutes />} />
      </Routes>
    </Router>
  </div>
);

