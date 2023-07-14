import * as React from 'react';
import {Container} from "react-bootstrap";
import {
    BrowserRouter, Route, Routes 
} from "react-router-dom";

import Header from "../components/Header";
import Home from "./Home";
import About from "./About";
import Usage from './Usage';
import Variants from './Variants';
import { DataStore } from '../store/DataStore';

class Main extends React.Component<{}>
{
    private store: DataStore = new DataStore();

    public render()
    {
        return (
            <BrowserRouter>
                <div className="Main">
                    <Header />
                    <Container
                        fluid={true}
                        style={{
                            paddingTop: 20,
                            paddingBottom: 100,
                            color: "#2c3e50"
                        }}
                    >
                        <Routes>
                            <Route path="/" element={<Home store={this.store} />} />
                            <Route path="/usage" element={<Usage />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/vue/:gene" element={<Variants store={this.store} />} />
                        </Routes>
                    </Container>
                </div>
            </BrowserRouter>
        );
    }
}

export default Main;