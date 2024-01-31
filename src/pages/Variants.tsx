import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RevisedProteinEffect, VUE } from '../model/VUE';
import { DataStore } from '../store/DataStore';
import { cbioportalLink, revisedProteinEffectSortingFn, getContextReferences } from '../utils/VUEUtils';
import { Container, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import './Variants.css';
import gnLogo from '../images/gn-logo.png';
import oncokbLogo from '../images/oncokb-logo.png';

interface IVariantsProps {
    store: DataStore;
}

export const Variants: React.FC<IVariantsProps> = (props) => {
    const [variantData, setVariantData] = useState<VUE>();

    const gene = useParams().gene;
    let countInitialized = false;
    let mskTotalSampleCount = 0;
    let mskGeneSampleCount = 0;
    let tcgaTotalSampleCount = 0;
    let tcgaGeneSampleCount = 0;

    useEffect(() => {
        const setData = async () => {
            setVariantData((await props.store.data).find(i => i.hugoGeneSymbol === gene));
        };

        setData();
    });

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    })

    function updateCount(revisedProteinEffect: RevisedProteinEffect) {
        if (!countInitialized) {
            mskTotalSampleCount = revisedProteinEffect.counts["mskimpact"].totalSampleCount;
            mskGeneSampleCount = revisedProteinEffect.counts["mskimpact"].geneSampleCount;
            tcgaTotalSampleCount = revisedProteinEffect.counts["tcga"].totalSampleCount;
            tcgaGeneSampleCount = revisedProteinEffect.counts["tcga"].geneSampleCount;
            countInitialized = true;
        }
    }

    if (variantData && variantData.revisedProteinEffects.length > 0) {
        const displayData = 
            variantData.revisedProteinEffects
            .sort(revisedProteinEffectSortingFn)
            .map((i) => {
                updateCount(i);
                return (
                    <tr>
                        <td>{i.variant}</td>
                        <td>{i.transcriptId}</td>
                        <td>{i.vepPredictedProteinEffect}</td>
                        <td>{i.vepPredictedVariantClassification}</td>
                        <td>{i.revisedProteinEffect}</td>
                        <td>{i.revisedVariantClassification}</td>
                        <td>{i.counts["mskimpact"].somaticVariantsCount + i.counts["mskimpact"].unknownVariantsCount}</td>
                        <td>{i.counts["tcga"].somaticVariantsCount + i.counts["tcga"].unknownVariantsCount}</td>
                        <td>
                            <a href={`https://www.genomenexus.org/variant/${i.variant}`} rel="noreferrer" target="_blank">
                                <img src={gnLogo} alt="gn-logo" style={{height: 20, marginRight: 10}} />
                            </a>
                            <a href={`https://www.oncokb.org/hgvsg/${i.variant}`} rel="noreferrer" target="_blank">
                                <img src={oncokbLogo} alt="oncokb-logo" style={{height: 16, marginRight: 10}} />
                            </a>
                            {cbioportalLink(i.revisedProteinEffect.substring(2), gene)}
                        </td>
                        <td>
                            {getContextReferences(variantData, true)}
                        </td>
                    </tr>
                );
            })

        return (
            <Container className="gene-page">
                <div className="title-container">
                <h1 className="title">{variantData.hugoGeneSymbol}</h1>
                <h2 className="subtitle" style={{fontWeight: "bold"}}>Actual Effect: <span style={{fontWeight: "normal"}}>{variantData.comment}</span></h2>
                <h3 className="subtitle" style={{fontWeight: "bold"}}>Context: <span style={{fontWeight: "normal"}}>{variantData.context}</span></h3>
                </div>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                        <   th>Variant <i className="fa fa-external-link" /></th>
                            <th>Transcript Id</th>
                            <th>Predicted Protein Effect by VEP</th>
                            <th>Predicted Variant Classification by VEP</th>
                            <th>Revised Protein Effect</th>
                            <th>Revised Variant Classification</th>
                            <th>MSK-IMPACT Variants Count
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={
                                        <Tooltip color='light' id="button-tooltip">
                                            Total sample count: {mskTotalSampleCount}
                                            <br/>
                                            {variantData.hugoGeneSymbol} sample count: {mskGeneSampleCount}
                                        </Tooltip>}
                                    >
                                    <i className={'fa fa-info-circle'} style={{marginLeft: 5}} />
                                </OverlayTrigger>
                            </th>
                            <th>TCGA Pan-Cancer Atlas Variants Count
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={
                                        <Tooltip color='light' id="button-tooltip">
                                            Total sample count: {tcgaTotalSampleCount}
                                            <br/>
                                            {variantData.hugoGeneSymbol} sample count: {tcgaGeneSampleCount}
                                        </Tooltip>}
                                    >
                                    <i className={'fa fa-info-circle'} style={{marginLeft: 5}} />
                                </OverlayTrigger>
                            </th>
                            <th>Linkouts</th>
                            <th>References</th>
                        </tr>
                    </thead>
                    <tbody>{displayData}</tbody>
                </Table>
                <div className="footer">All positions are in hg19</div>
            </Container>
        );
    }
    return <></>;
}

export default Variants;