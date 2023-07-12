import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { VUE } from '../model/VUE';
import { fetchVueData } from '../utils/VUEDataFetcherUtils';

export const Variants: React.FC = () => {
    const state = useLocation().state;
    const [vue, setVue] = useState<VUE | undefined>(state);

    const gene = useParams().gene;

    useEffect(() => {
        if (!state) {
            const fetchData = async () => {
                const data = await fetchVueData();
                setVue(data.find(i => i.hugoGeneSymbol === gene));
            };
    
            fetchData();
        }
    }, [gene, state]);

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    })

    if (vue && vue.revisedProteinEffects.length > 1) {
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
    return <></>
}

export default Variants;