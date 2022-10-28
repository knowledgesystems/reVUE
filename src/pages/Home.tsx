
import * as React from 'react';
import VUETable from '../components/VUETable';

import vueLogo from "./../images/vue_logo.png";

class Home extends React.Component<{}>
{
    public render()
    {
        return (
            <React.Fragment>
                <div className="jumbotron jumbotron-fluid">
                    <h1 className="display-4">
                        <img alt='reVUE logo' src={vueLogo} width={60} style={{paddingRight:10}}/>
                        reVUE
                    </h1>
                    <p className="lead">A Repository for Variants with Unexpected Effects (VUE) in Cancer</p>
                    <hr className="my-4" />
                    <span>A curated database of known protein effects for those variants that aren't as easily predicted by conventional annotation tools.</span>
                </div>
                <p className='text-left'>
                    <VUETable />
                </p>
            </React.Fragment>
        );
    }
}

export default Home;