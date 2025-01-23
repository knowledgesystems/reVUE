import * as React from 'react';
import VUETable from '../components/VUETable';
import { DataStore } from '../store/DataStore';
import vueLogo from "./../images/vue_logo.png";

interface IHomeProps {
    store: DataStore;
}

const Home: React.FC<IHomeProps> = ( props ) => {
        return (
            <React.Fragment>
                <div className="jumbotron jumbotron-fluid">
                    <h1 className="display-4">
                        <img alt='reVUE logo' src={vueLogo} width={60} style={{paddingRight:10}}/>
                        reVUE
                    </h1>
                    <p className="lead">A Repository for Variants with Unexpected Effects (VUE) in Cancer</p> 
                    <span>A curated database of known protein effects for those variants that aren't as easily predicted by conventional annotation tools.</span>

                </div>
                <p className='text-left'>
                    <VUETable store={props.store}/>
                </p>
            </React.Fragment>
        );
}

export default Home;