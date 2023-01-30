import React from 'react';
import { default as VUEData } from './../data/VUEs.json';

import vueLogo from "./../images/vue_logo.png";

class VUETable extends React.Component<{}> {
    public render() {
        const DisplayData = VUEData.map((info) => {
            return (
                <tr>
                    <td>{info.hugoGeneSymbol}</td>
                    <td>{info.genomicLocation}</td>
                    <td>{info.defaultEffect}</td>
                    <td>{info.comment}</td>
                    <td>{info.context}{info.referenceText && (<>{' '}<a href={`https://pubmed.ncbi.nlm.nih.gov/${info.pubmedIds[0]}/`} rel="noreferrer" target="_blank">({info.referenceText})</a></>)}</td>
                    <td>{info.revisedProteinEffects && (<a href={`https://deploy-preview-139--genome-nexus-frontend.netlify.app/variant/${info.revisedProteinEffects[0].variant}`} rel="noreferrer" target="_blank">Genome Nexus <i className="fa fa-external-link" /></a>)}</td>
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
}

export default VUETable;