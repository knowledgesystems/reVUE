import * as React from 'react';
import VUETable from '../components/VUETable';
import { DataStore } from '../store/DataStore';

import vueLogo from "./../images/vue_logo.png";

interface IHomeProps {
    store: DataStore;
}

const Home: React.FC<IHomeProps> = ( props ) => {
    const [totalGenes, setTotalGenes] = React.useState(0);
    const [curatedVUEs, setCuratedVUEs] = React.useState(0);

    React.useEffect(() => {
        props.store.data.then(vueArray => {
            setTotalGenes(vueArray.length);
            let totalRevisedProteinEffects = 0;
            vueArray.forEach(vue => {
                totalRevisedProteinEffects += vue.revisedProteinEffects.length;
            });
            setCuratedVUEs(totalRevisedProteinEffects);
        });
    }, [props.store]);

        return (
            <React.Fragment>
                <div className="jumbotron jumbotron-fluid">
                    <h1 className="display-4">
                        <img alt='reVUE logo' src={vueLogo} width={60} style={{paddingRight:10}}/>
                        reVUE
                    </h1>
                    <p className="lead">A Repository for Variants with Unexpected Effects (VUE) in Cancer</p> 
                    <span>A curated database of known protein effects for those variants that aren't as easily predicted by conventional annotation tools.</span>
                    <hr className="my-4" />
                    <div>Total genes:{` `}{totalGenes}</div>
                    <div>Curated VUEs:{` `}{curatedVUEs}</div>
                </div>
                <p className='text-left'>
                    <VUETable store={props.store}/>
                </p>
            </React.Fragment>
        );
}

export default Home;