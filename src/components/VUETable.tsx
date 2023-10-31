import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VUE } from '../model/VUE';
import { getLinks } from '../utils/VUEUtils';
import "./VUETable.css";
import vueLogo from "./../images/vue_logo.png";
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
                <td>{info.hugoGeneSymbol}</td>
                <td>{info.genomicLocationDescription}{info.revisedProteinEffects.length > 1 && <Link style={{ marginLeft: '10px' }} to={`/vue/${info.hugoGeneSymbol}`}>View All</Link>}</td>
                <td>{info.defaultEffect}</td>
                <td>{info.comment}</td>
                <td>{info.context ? `${info.context} (` : ``}{getLinks(info)}{info.context ? `)` : ``}</td>
                <td>{info.revisedProteinEffects && (
                    <>
                        <a href={`https://www.genomenexus.org/variant/${info.revisedProteinEffects[0].variant}`} rel="noreferrer" target="_blank">Genome Nexus <i className="fa fa-external-link" /></a>
                        <br />
                        <a href={`https://www.cbioportal.org/results/mutations?cancer_study_list=msk_impact_2017%2Ccrc_msk_2017&Z_SCORE_THRESHOLD=2.0&RPPA_SCORE_THRESHOLD=2.0&profileFilter=mutations%2Cstructural_variants%2Ccna%2Cgistic&case_set_id=all&gene_list=${info.hugoGeneSymbol}&geneset_list=%20&tab_index=tab_visualize&Action=Submit`} rel="noreferrer" target="_blank">cBioPortal <i className="fa fa-external-link" /></a>
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