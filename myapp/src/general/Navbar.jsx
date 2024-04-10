import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LogoPath from './img/PathPilotLogoNavBar.svg' ;
import AirplanePath from './img/airplane.svg';

const NavbarBoot = () => {
    return (
        <Navbar bg="primary" data-bs-theme="dark">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <img
                src={AirplanePath}
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="Path Pilot Logo"
              />
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/planning">Planning</Nav.Link>
            <Nav.Link as={Link} to="/login">Log in</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    )
};

export default NavbarBoot;