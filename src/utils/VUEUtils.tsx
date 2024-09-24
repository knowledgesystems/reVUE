import { Reference, RevisedProteinEffect, VUE } from "../model/VUE";
import cbioportalLogo from "../images/cbioportal-logo.png";
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { FunctionComponent } from "react";

export const cbioportalLink = (proteinChange: string, gene?: string, ) => {
    // for now only show APC and CTNNB1
    const geneList = ['APC', 'CTNNB1'];
    if (gene !== undefined && geneList.includes(gene)) {
        return <a href={`https://www.cbioportal.org/results/mutations?cancer_study_list=msk_impact_2017%2Ccrc_msk_2017&Z_SCORE_THRESHOLD=2.0&RPPA_SCORE_THRESHOLD=2.0&profileFilter=mutations%2Cstructural_variants%2Ccna%2Cgistic&case_set_id=all&gene_list=${gene}:${proteinChange}&geneset_list=%20&tab_index=tab_visualize&Action=Submit`} rel="noreferrer" target="_blank">
                    <img src={cbioportalLogo} alt="cbioportal-logo" style={{height: 16}} />
               </a>;
    }
    else {
        return <></>;
    }
} 

export const fetchVueData = async (): Promise<VUE[]> => {
    try {
        const response = await fetch(
            'https://raw.githubusercontent.com/knowledgesystems/reVUE-data/b49aac76e5e27d94dc059b67f22556c2792d31ad/VUEs.json'
        );
        const vues: VUE[] = await response.json();
        // Sort revisedProteinEffects by counts
        for (const vue of vues) {
            vue.revisedProteinEffects = vue.revisedProteinEffects.sort(revisedProteinEffectSortingFn);
        }
        return vues;
    } catch (error) {
        console.error('Error fetching JSON:', error);
        return [];
    }
};

export const getReferencesText = (vue: VUE) => {
    const uniqueReferences: Reference[] = [];
    vue.revisedProteinEffects.forEach(v => {
        vue.revisedProteinEffects.forEach(v => {
            v.references.forEach(ref => {
            let i = uniqueReferences.findIndex(r => r.referenceText === ref.referenceText && r.pubmedId === ref.pubmedId);
            if (i === -1) {
                uniqueReferences.push(ref);
            }
            });
        });
    })
    return uniqueReferences;
}

export const getLinks = (references: Reference[]) => {
    const links = references.map((reference, i) =>{
        // pubmedId = 0 means this variant is reported by users and does not have any paper as reference
        return reference.pubmedId === 0 ? <>{reference.referenceText}</> :
            <>
                <a href={`https://pubmed.ncbi.nlm.nih.gov/${reference.pubmedId}/`} rel="noreferrer" target="_blank">
                    {reference.referenceText}
                </a>
                {(i !== references.length - 1) && '; '}
            </> 
    } )

    return links;
}

export const getContextReferences = (vue: VUE, referenceOnly?: boolean) => {
    let context = vue.context || "";
    let referencesWithoutLinkTextList = [];
    const referencesWithLink = [];
    for (const reference of getReferencesText(vue)) {
        if (reference.pubmedId === 0) {
            referencesWithoutLinkTextList.push(reference.referenceText);
        } else {
            const splitedReferenceText = reference.referenceText.split(';');
            if (splitedReferenceText.length === 2) {
                referencesWithoutLinkTextList.push(splitedReferenceText[0]);
                referencesWithLink.push({
                    referenceText: splitedReferenceText[1],
                    pubmedId: reference.pubmedId
                })
            } else {
                referencesWithLink.push(reference);
            }
        }
    }
    const referencesWithoutLinkText = referencesWithoutLinkTextList.length > 0 ? referencesWithoutLinkTextList.join("; ") + "; ": "";
    if (context) {
        return (
            <>
                {!referenceOnly && `${context} (`}
                {referencesWithoutLinkText}
                {getLinks(referencesWithLink)}
                {!referenceOnly &&`)`}
            </>
        );
    } else {
        return (
            <>
                {referencesWithoutLinkText}
                {getLinks(referencesWithLink)}
            </>
        );
    }
}

export const CustomToggle: FunctionComponent<any> = (props: any) => {
    const decoratedOnClick = useAccordionButton(props.eventKey, () =>
      console.log('totally custom!'),
    );
  
    return (
      <button
        type="button"
        style={{ backgroundColor: 'pink' }}
        onClick={decoratedOnClick}
      >
        {props.children}
      </button>
    );
  }

export const revisedProteinEffectSortingFn = (a: RevisedProteinEffect, b: RevisedProteinEffect) => {return (b.counts["mskimpact"].somaticVariantsCount + b.counts["mskimpact"].unknownVariantsCount) - (a.counts["mskimpact"].somaticVariantsCount + a.counts["mskimpact"].unknownVariantsCount)};
