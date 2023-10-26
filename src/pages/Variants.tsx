import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VUE } from '../model/VUE';
import { DataStore } from '../store/DataStore';
import { getLinks } from '../utils/VUEUtils';

interface IVariantsProps {
    store: DataStore;
}

export const Variants: React.FC<IVariantsProps> = (props) => {
    const [variantData, setVariantData] = useState<VUE>();

    const gene = useParams().gene;

    useEffect(() => {
        const setData = async () => {
            setVariantData((await props.store.data).find(i => i.hugoGeneSymbol === gene));
        };

        setData();
    });

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    })

    if (variantData && variantData.revisedProteinEffects.length > 1) {
        const displayData = 
            variantData.revisedProteinEffects.map((i) => {
                return (
                    <tr>
                        <td>{i.variant}</td>
                        <td>{i.transcriptId}</td>
                        <td>{i.vepPredictedProteinEffect}</td>
                        <td>{i.vepPredictedVariantClassification}</td>
                        <td>{i.revisedProteinEffect}</td>
                        <td>{i.revisedVariantClassification}</td>
                        <td><a href={`https://www.genomenexus.org/variant/${i.variant}`} rel="noreferrer" target="_blank">{i.variant}</a></td>
                    </tr>
                );
            })

        return (
            <div>
                <p>
                    <span style={{ fontWeight: 'bold' }}>Gene: </span>{variantData.hugoGeneSymbol}
                    <br/>
                    <span style={{ fontWeight: 'bold' }}>Genomic Location: </span>{variantData.genomicLocationDescription}
                    <br/>
                    <span style={{ fontWeight: 'bold' }}>Predicted Effect: </span>{variantData.defaultEffect}
                    <br/>
                    <span style={{ fontWeight: 'bold' }}>Actual Effect: </span>{variantData.comment}
                    <br/>
                    <span style={{ fontWeight: 'bold' }}>Context & References: </span>{variantData.context}{' '}{getLinks(variantData)}
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
                            <th>Genome Nexus <i className="fa fa-external-link" /></th>
                        </tr>
                    </thead>
                    <tbody>{displayData}</tbody>
                </table>
            </div>
        );
    }
    return <></>;
}

export default Variants;