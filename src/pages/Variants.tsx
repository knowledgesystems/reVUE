import React from 'react';
import { useLocation } from 'react-router-dom';
import { VUE } from '../model/VUE';

export const Variants: React.FC = () => {
    const vue: VUE = useLocation().state

    const DisplayData = 
        vue.revisedProteinEffects.map((i) => {
            return (
                <tr>
                    <td>{i.variant}</td>
                    <td>{i.transcriptId}</td>
                    <td>{i.revisedProteinEffect}</td>
                    <td>{i.variantClassification}</td>
                </tr>
            );
        })    

    return (
        <div>
            <p>
                <span style={{ fontWeight: 'bold' }}>Gene: </span>{vue.hugoGeneSymbol}
                <br/>
                <span style={{ fontWeight: 'bold' }}>Genomic Location: </span>{vue.genomicLocation}
                <br/>
                <span style={{ fontWeight: 'bold' }}>Predicted Effect: </span>{vue.defaultEffect}
                <br/>
                <span style={{ fontWeight: 'bold' }}>Actual Effect: </span>{vue.comment}
                <br/>
                <span style={{ fontWeight: 'bold' }}>Context & Reference: </span>{vue.context}{' '}<a href={`https://pubmed.ncbi.nlm.nih.gov/${vue.pubmedIds[0]}/`} rel="noreferrer" target="_blank">({vue.referenceText})</a>
            </p>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Variant</th>
                        <th>Transcript Id</th>
                        <th>Revised Protein Effect</th>
                        <th>Variant Classification</th>
                    </tr>
                </thead>
                <tbody>{DisplayData}</tbody>
            </table>
        </div>
    );
}

export default Variants;