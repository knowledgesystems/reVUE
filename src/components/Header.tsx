import * as React from 'react';
import {
    Container, Nav, Navbar
} from 'react-bootstrap';
import {
    LinkContainer
} from "react-router-bootstrap";
import {
    Link
} from "react-router-dom";

import "./Header.css";

class Header extends React.Component<{}>
{
    public render()
    {
        return (
            <header className="sticky-top">
                <Navbar bg="mskcc-header" expand="lg" className="navbar-dark main-navbar">
                    <Container fluid={true}>
                        <Navbar.Brand>
                            <Link to="/" className="brand-title-link">
                                reVUE
                            </Link>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                        <Navbar.Collapse>
                            <Nav>
                                <Nav.Item>
                                    <LinkContainer to="/"><Nav.Link>Home</Nav.Link></LinkContainer>
                                </Nav.Item>
                                <Nav.Item>
                                    <LinkContainer to="/about"><Nav.Link>About</Nav.Link></LinkContainer>
                                </Nav.Item>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }
}

export default Header;