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

import vueLogo from "./../images/vue_logo.png";

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSemX-RHhbMhDcrvA5xT44QbK3PiBAiZNP1qhOT72wketzbw_g/viewform";

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
                                <img src={vueLogo} width={40} style={{paddingRight:10}}/>
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
                                <Nav.Item>
                                    <Nav.Link href={GOOGLE_FORM_URL} target="_blank">Contribute a Variant <i className="fa fa-external-link" /></Nav.Link>
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