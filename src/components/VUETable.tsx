import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VUE } from '../model/VUE';
import { cbioportalLink, getLinks } from '../utils/VUEUtils';
import "./VUETable.css";
import vueLogo from "./../images/vue_logo.png";
import gnLogo from '../images/gn-logo.png';
import oncokbLogo from '../images/oncokb-logo.png';
import { DataStore } from '../store/DataStore';

interface IVUETableProps {
    store: DataStore;
}

export const VUETable: React.FC<IVUETableProps> = (props) => {
    const [vueData, setVueData] = useState<VUE[]>([]);

    useEffect(() => {
        const setData = async () => {
            setVueData(await props.store.data);
        }

        setData();
    });

    const displayData = vueData.map((info) => {
        return (
            <tr>
                <td><Link to={`/vue/${info.hugoGeneSymbol}`}>{info.hugoGeneSymbol}</Link></td>
                <td>{info.genomicLocationDescription}</td>
                <td>{info.defaultEffect}</td>
                <td>{info.comment}</td>
                <td>{info.context ? `${info.context} (` : ``}{getLinks(info)}{info.context ? `)` : ``}</td>
                <td>{info.revisedProteinEffects && (
                    <>
                        <a href={`https://www.genomenexus.org/variant/${info.revisedProteinEffects[0].variant}`} rel="noreferrer" target="_blank">
                            <img src={gnLogo} alt="gn-logo" style={{height: 20, marginRight: 10}} />
                        </a>
                        <a href={`https://www.oncokb.org/hgvsg/${info.revisedProteinEffects[0].variant}`} rel="noreferrer" target="_blank">
                            <img src={oncokbLogo} alt="oncokb-logo" style={{height: 16, marginRight: 10}} />
                        </a>
                        {cbioportalLink(info.revisedProteinEffects[0].revisedProteinEffect.substring(2), info.hugoGeneSymbol)}
                    </>)}
                </td>
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
                <tbody>{displayData}</tbody>
            </table>
        </div>
    );
}

export default VUETable;