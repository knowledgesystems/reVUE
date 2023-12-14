import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VUE } from '../model/VUE';
import { DataStore } from '../store/DataStore';
import { cbioportalLink, getLinks } from '../utils/VUEUtils';
import { Container, Table } from 'react-bootstrap';
import './Variants.css';
import gnLogo from '../images/gn-logo.png';
import oncokbLogo from '../images/oncokb-logo.png';

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
                        <td>{i.mutationOrigin}</td>
                        <td>{i.pubmedId === 0 ? <>{i.referenceText}</> : <a href={`https://pubmed.ncbi.nlm.nih.gov/${i.pubmedId}/`} rel="noreferrer" target="_blank">
                            {i.referenceText}
                            </a>}
                        </td>
                        <td>
                            <a href={`https://www.genomenexus.org/variant/${i.variant}`} rel="noreferrer" target="_blank">
                                <img src={gnLogo} alt="gn-logo" style={{height: 20, marginRight: 10}} />
                            </a>
                            <a href={`https://www.oncokb.org/hgvsg/${i.variant}`} rel="noreferrer" target="_blank">
                                <img src={oncokbLogo} alt="oncokb-logo" style={{height: 16, marginRight: 10}} />
                            </a>
                            {cbioportalLink(i.revisedProteinEffect.substring(2), gene)}
                        </td>
                    </tr>
                );
            })

        return (
            <Container className="gene-page">
                <div className="title-container">
                <h1 className="title">{variantData.hugoGeneSymbol}</h1>
                <h2 className="subtitle" style={{fontWeight: "bold"}}>Actual Effect: <span style={{fontWeight: "normal"}}>{variantData.comment}</span></h2>
                <h3 className="subtitle" style={{fontWeight: "bold"}}>Context & References: <span style={{fontWeight: "normal"}}>{variantData.context}{' '}{getLinks(variantData)}</span></h3>
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
                            <th>Linkouts</th>
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