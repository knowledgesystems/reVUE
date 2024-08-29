import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VUE } from '../model/VUE';
import { cbioportalLink, getContextReferences } from '../utils/VUEUtils';
import vueLogo from "./../images/vue_logo.png";
import gnLogo from '../images/gn-logo.png';
import oncokbLogo from '../images/oncokb-logo.png';
import { DataStore } from '../store/DataStore';
import { Table, Accordion } from 'react-bootstrap';
import "./VUETable.css";

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

    const displayData = vueData.map((info, index) => {
        const revisedProteinEffectList = info.revisedProteinEffects?.map(e => e.revisedProteinEffect) || [];
        const uniqueRevisedProteinEffectList = revisedProteinEffectList.filter((value, index, array) => array.indexOf(value) === index);
        let highestTherapeuticLevel = "Oncogenic";
        info.revisedProteinEffects?.map(e => {
            let highestLevel = Infinity;
            if (e.therapeuticLevel && parseInt(e.therapeuticLevel.split('_')[1]) < highestLevel) {
                highestLevel = parseInt(e.therapeuticLevel.split('_')[1]);
                highestTherapeuticLevel = e.therapeuticLevel;
            }
        });
        return (
            <tr >
                <td><Link to={`/vue/${info.hugoGeneSymbol}`}>{info.hugoGeneSymbol}</Link></td>
                <td style={{textAlign:"right"}}>{info.revisedProteinEffects.length}</td>
                <td>{highestTherapeuticLevel}</td>
                <td>{info.defaultEffect}</td>
                <td>{info.comment}</td>
                <td>
                    <div style={{width: 150}}>
                        {uniqueRevisedProteinEffectList.length === 1 ? uniqueRevisedProteinEffectList[0] : ""}
                        {uniqueRevisedProteinEffectList.length > 1 && (
                            <Accordion as={"p"} flush>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header className='CollapseHeader'>{"Multiple"} <i className="fa fa-chevron-circle-down"/></Accordion.Header>
                                    <Accordion.Body>
                                        {uniqueRevisedProteinEffectList.join(", ")}
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                    )}</div>
                </td>
                <td>{getContextReferences(info)}</td>
                <td>{info.revisedProteinEffects && (
                    <>
                        <a href={`https://www.genomenexus.org/variant/${info.revisedProteinEffects[0].variant}`} rel="noreferrer" target="_blank">
                            <img src={gnLogo} alt="gn-logo" style={{height: 20, marginRight: 10}} />
                        </a>
                        <a href={`https://www.oncokb.org/hgvsg/${info.revisedProteinEffects[0].variant}`} rel="noreferrer" target="_blank">
                            <img src={oncokbLogo} alt="oncokb-logo" style={{height: 16, marginRight: 10}} />
                        </a>
                        {cbioportalLink(info.revisedProteinEffects[0].revisedProteinEffect.substring(2), info.hugoGeneSymbol)}
                    </>
                )}
                </td>
                </tr>
        );
    });

    return (
        <div>
            <Table  bordered hover responsive className='vue-table'>
            {/* <table className="table table-stripeds vue-table"> */}
                <thead>
                    <tr>
                        <th>Gene</th>
                        <th>Variants Count</th>
                        <th>Therapeutic Level</th>
                        <th>Predicted Effect</th>
                        <th>
                            <img alt='reVUE logo' src={vueLogo} width={20} style={{marginBottom:2}} />{' '}
                            Actual Effect
                        </th>
                        <th>Revised Protein Change</th>
                        <th>Context & References</th>
                        <th>Usage Example</th>
                    </tr>
                </thead>
                <tbody>{displayData}</tbody>
            </Table>
        </div>
    );
}

export default VUETable;