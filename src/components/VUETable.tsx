import React, { useEffect, useState } from 'react';
import vueLogo from "./../images/vue_logo.png";
import { VUE } from './VueUtils';
import { fetchVueData } from '../store/dataStore';

const VUETable: React.FC = () => {
    const [vueData, setVueData] = useState<VUE[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          const data = await fetchVueData();
          setVueData(data);
        };
    
        fetchData();
      }, []);
    
    const DisplayData = vueData.map((info) => {
        return (
            <tr>
                <td>{info.hugoGeneSymbol}</td>
                <td>{info.genomicLocation}</td>
                <td>{info.defaultEffect}</td>
                <td>{info.comment}</td>
                <td>{info.context}{info.referenceText && (<>{' '}<a href={`https://pubmed.ncbi.nlm.nih.gov/${info.pubmedIds[0]}/`} rel="noreferrer" target="_blank">({info.referenceText})</a></>)}</td>
                <td>{info.revisedProteinEffects && (<a href={`https://www.genomenexus.org/variant/${info.revisedProteinEffects.variant}`} rel="noreferrer" target="_blank">Genome Nexus <i className="fa fa-external-link" /></a>)}</td>
            </tr>
        );
    });

    return (
        <div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Gene</th>
                        <th>Genomic Location</th>
                        <th>Predicted Effect</th>
                        <th>
                            <img alt='reVUE logo' src={vueLogo} width={20} style={{marginBottom:2}} />{' '}
                            Actual Effect
                        </th>
                        <th>Context & Reference</th>
                        <th>Usage Example</th>
                    </tr>
                </thead>
                <tbody>{DisplayData}</tbody>
            </table>
        </div>
    );
}

export default VUETable;