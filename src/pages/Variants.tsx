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
                        <td>{i.vepPredictedProteinEffect}</td>
                        <td>{i.vepPredictedVariantClassification}</td>
                        <td>{i.revisedProteinEffect}</td>
                        <td>{i.revisedVariantClassification}</td>
                    </tr>
                );
            })

        const references: { referenceText: string, pubmedId: number }[] = [];
        vue.revisedProteinEffects.map(v => ({ referenceText: v.referenceText, pubmedId: v.pubmedId })).filter(r => {
            let i = references.findIndex(ref => (ref.referenceText === r.referenceText && ref.pubmedId === r.pubmedId))
            if (i <= -1) {
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
            <div>
                <p>
                    <span style={{ fontWeight: 'bold' }}>Gene: </span>{vue.hugoGeneSymbol}
                    <br/>
                    <span style={{ fontWeight: 'bold' }}>Genomic Location: </span>{vue.genomicLocationDescription}
                    <br/>
                    <span style={{ fontWeight: 'bold' }}>Predicted Effect: </span>{vue.defaultEffect}
                    <br/>
                    <span style={{ fontWeight: 'bold' }}>Actual Effect: </span>{vue.comment}
                    <br/>
                    <span style={{ fontWeight: 'bold' }}>Context & References: </span>{vue.context}{' '}{links}
                </p>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Variant</th>
                            <th>Transcript Id</th>
                            <th>Predicted Protein Effect by VEP</th>
                            <th>Predicted Variant Classification by VEP</th>
                            <th>Revised Protein Effect</th>
                            <th>Revised Variant Classification</th>
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