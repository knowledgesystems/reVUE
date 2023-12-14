import { VUE } from "../model/VUE";
import cbioportalLogo from "../images/cbioportal-logo.png";

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
            'https://raw.githubusercontent.com/knowledgesystems/reVUE-data/ddcb06f417209eb6cf602dd1291a4bb605b4bd6f/VUEs.json'
        );
        const json = await response.json();
        return json;
    } catch (error) {
        console.error('Error fetching JSON:', error);
        return [];
    }
};

export const getLinks = (vue: VUE) => {
    const uniqueReferences: { referenceText: string, pubmedId: number }[] = [];
    vue.revisedProteinEffects.forEach(v => {
        let i = uniqueReferences.findIndex(ref => (ref.referenceText === v.referenceText && ref.pubmedId === v.pubmedId))
        if (i === -1) {
            uniqueReferences.push({
                referenceText: v.referenceText,
                pubmedId: v.pubmedId
            });
        }
    })

    const links = uniqueReferences.map((reference, i) =>{
        // pubmedId = 0 means this variant is reported by users and does not have any paper as reference
        return reference.pubmedId === 0 ? <>{reference.referenceText}</> :
            <>
                <a href={`https://pubmed.ncbi.nlm.nih.gov/${reference.pubmedId}/`} rel="noreferrer" target="_blank">
                    {reference.referenceText}
                </a>
                {(i !== uniqueReferences.length - 1) && '; '}
            </> 
    } )

    return links;
}
