import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VUE } from '../model/VUE';
import { fetchVueData } from '../utils/VUEDataFetcherUtils';
import "./VUETable.css";

import vueLogo from "./../images/vue_logo.png";

export const VUETable: React.FC = () => {
    const [vueData, setVueData] = useState<VUE[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          const data = await fetchVueData();
          setVueData(data);
        };

        fetchData();
    }, []);

    const DisplayData = vueData.map((info) => {
        const references: { referenceText: string, pubmedId: number }[] = [];
        info.revisedProteinEffects.map(v => ({ referenceText: v.referenceText, pubmedId: v.pubmedId })).filter(r => {
            let i = references.findIndex(ref => (ref.referenceText === r.referenceText && ref.pubmedId === r.pubmedId))
            if (i === -1) {
                references.push(r)
            }
            return null;
        })

        const links = references.map<React.ReactNode>(reference => 
            (<>
                <a href={`https://pubmed.ncbi.nlm.nih.gov/${reference.pubmedId}/`} rel="noreferrer" target="_blank">
                    ({reference.referenceText})
                </a>
            </>)
        ).reduce((prev, curr) => [prev, ', ', curr])

        return (
            <tr>
                <td>{info.hugoGeneSymbol}</td>
                <td>{info.genomicLocationDescription}{info.revisedProteinEffects.length > 1 && <Link style={{ marginLeft: '10px' }} to={`/vue/${info.hugoGeneSymbol}`} state={info}><button className='btn-sm'>View All</button></Link>}</td>
                <td>{info.defaultEffect}</td>
                <td>{info.comment}</td>
                <td>{info.context}{' '}{links}</td>
                <td>{info.revisedProteinEffects && (<a href={`https://deploy-preview-139--genome-nexus-frontend.netlify.app/variant/${info.revisedProteinEffects[0].variant}`} rel="noreferrer" target="_blank">Genome Nexus <i className="fa fa-external-link" /></a>)}</td>
            </tr>
        );
    });

    return (
        <div>
            <table className="table table-stripeds vue-table">
                <thead>
                    <tr>
                        <th>Gene</th>
                        <th>Genomic Location</th>
                        <th>Predicted Effect</th>
                        <th>
                            <img alt='reVUE logo' src={vueLogo} width={20} style={{marginBottom:2}} />{' '}
                            Actual Effect
                        </th>
                        <th>Context & References</th>
                        <th>Usage Example</th>
                    </tr>
                </thead>
                <tbody>{DisplayData}</tbody>
            </table>
        </div>
    );
}

export default VUETable;