import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VUE } from '../model/VUE';
import { DataStore } from '../store/DataStore';
import { getLinks } from '../utils/VUEUtils';
import { Container, Table } from 'react-bootstrap';
import './Variants.css';


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
                        <td><a href={`https://www.genomenexus.org/variant/${i.variant}`} rel="noreferrer" target="_blank">{i.variant}</a></td>
                        <td>{i.transcriptId}</td>
                        <td>{i.vepPredictedProteinEffect}</td>
                        <td>{i.vepPredictedVariantClassification}</td>
                        <td>{i.revisedProteinEffect}</td>
                        <td>{i.revisedVariantClassification}</td>
                        <td>{i.mutationOrigin}</td>
                        <td><a href={`https://pubmed.ncbi.nlm.nih.gov/${i.pubmedId}/`} rel="noreferrer" target="_blank">
                            {i.referenceText}
                            </a>
                        </td>
                    </tr>
                );
            })

        return (
            <Container className="gene-page">
                <div className="title-container">
                <h1 className="title">{variantData.hugoGeneSymbol}</h1>
                <h2 className="subtitle">Actual Effect: {variantData.comment}</h2>
                <h3 className="subtitle">Context & References: {variantData.context}{' '}{getLinks(variantData)}</h3>
                </div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <   th>Variant <i className="fa fa-external-link" /></th>
                            <th>Transcript Id</th>
                            <th>Predicted Protein Effect by VEP</th>
                            <th>Predicted Variant Classification by VEP</th>
                            <th>Revised Protein Effect</th>
                            <th>Revised Variant Classification</th>
                            <th>Mutation Origin</th>
                            <th>Context & References</th>
                        </tr>
                    </thead>
                    <tbody>{displayData}</tbody>
                </Table>
            </Container>
        );
    }
    return <></>;
}

export default Variants;