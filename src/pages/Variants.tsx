import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VUE } from '../model/VUE';
import { DataStore } from '../store/DataStore';
import { getLinks } from '../utils/VUEUtils';
import { Container, Table } from 'react-bootstrap';
import './Variants.css';
import gnLogo from '../images/gn-logo.png';
import oncokbLogo from '../images/oncokb-logo.png';
import cbioportalLogo from '../images/cbioportal-logo.png';

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
                        <td>
                            <a href={`https://www.genomenexus.org/variant/${i.variant}`} rel="noreferrer" target="_blank">
                                <img src={gnLogo} alt="gn-logo" style={{height: 20, marginRight: 10}} />
                            </a>
                            <a href={`https://www.oncokb.org/hgvsg/${i.variant}`} rel="noreferrer" target="_blank">
                                <img src={oncokbLogo} alt="oncokb-logo" style={{height: 16, marginRight: 10}} />
                            </a>
                            <a href={`https://www.cbioportal.org/results/mutations?cancer_study_list=msk_impact_2017%2Ccrc_msk_2017&Z_SCORE_THRESHOLD=2.0&RPPA_SCORE_THRESHOLD=2.0&profileFilter=mutations%2Cstructural_variants%2Ccna%2Cgistic&case_set_id=all&gene_list=${gene}&geneset_list=%20&tab_index=tab_visualize&Action=Submit`} rel="noreferrer" target="_blank">
                                <img src={cbioportalLogo} alt="cbioportal-logo" style={{height: 16}} />
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