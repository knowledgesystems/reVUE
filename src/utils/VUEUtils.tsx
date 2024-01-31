import { RevisedProteinEffect, VUE } from "../model/VUE";
import cbioportalLogo from "../images/cbioportal-logo.png";

export type Reference = {
    referenceText: string;
    pubmedId: number;
};

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
            'https://raw.githubusercontent.com/knowledgesystems/reVUE-data/166fed92151ed09051f8cb10e58edc40ae1cd2a5/VUEs.json'
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
        let i = uniqueReferences.findIndex(ref => (ref.referenceText === v.referenceText && ref.pubmedId === v.pubmedId))
        if (i === -1) {
            uniqueReferences.push({
                referenceText: v.referenceText,
                pubmedId: v.pubmedId
            });
        }
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

export const getLinksFromVue = (vue: VUE) => {
    return getLinks(getReferencesText(vue));
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
                {`)`}
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

export const revisedProteinEffectSortingFn = (a: RevisedProteinEffect, b: RevisedProteinEffect) => {return (b.counts["mskimpact"].somaticVariantsCount + b.counts["mskimpact"].unknownVariantsCount) - (a.counts["mskimpact"].somaticVariantsCount + a.counts["mskimpact"].unknownVariantsCount)};
