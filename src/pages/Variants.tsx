import React from 'react';
import { useParams } from 'react-router-dom';
import { default as VUEData } from '../data/VUEs.json';

export default function Variants() {
    const gene = useParams().gene

    const data = VUEData.find(i => i.hugoGeneSymbol === gene);
    if (data && data.revisedProteinEffects.length > 1) {
        const DisplayData = 
            data.revisedProteinEffects.map((i) => {
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
                    <span style={{ fontWeight: 'bold' }}>Gene: </span>{gene}
                    <br/>
                    <span style={{ fontWeight: 'bold' }}>Genomic Location: </span>{data.genomicLocation}
                    <br/>
                    <span style={{ fontWeight: 'bold' }}>Predicted Effect: </span>{data.defaultEffect}
                    <br/>
                    <span style={{ fontWeight: 'bold' }}>Actual Effect: </span>{data.comment}
                    <br/>
                    <span style={{ fontWeight: 'bold' }}>Context & Reference: </span>{data.context}{' '}<a href={`https://pubmed.ncbi.nlm.nih.gov/${data.pubmedIds[0]}/`} rel="noreferrer" target="_blank">({data.referenceText})</a>
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
    return <></>
}