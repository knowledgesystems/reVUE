import { Reference, RevisedProteinEffect, VUE } from "../model/VUE";
import cbioportalLogo from "../images/cbioportal-logo.png";

export type ContextAndReferences = {
    context: string;
    references: Reference[];
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
            'https://raw.githubusercontent.com/knowledgesystems/reVUE-data/e749cb7c9d64cd7c3e1a792744e7c781b73f0685/generated/VUEs.json'
        );
        let vues: VUE[] = await response.json();
        // Sort VUEs by genes in alphabetical order
        vues = vues.sort((a, b) => a.hugoGeneSymbol.localeCompare(b.hugoGeneSymbol));
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

const getLinks = (references: Reference[]) => {
    return references.map((reference, i) => {
        const pubmedId = Number(reference.pubmedId);
        return pubmedId === 0 ? (
            <>{reference.referenceText}{i !== references.length - 1 && '; '}</>
        ) : (
            <>
                <a href={`https://pubmed.ncbi.nlm.nih.gov/${pubmedId}/`} rel="noreferrer" target="_blank">
                    {reference.referenceText}
                </a>
                {i !== references.length - 1 && '; '}
            </>
        );
    });
};

export const extractContextAndReferences = (vue: VUE): ContextAndReferences => {
    let context = vue.context || "";
    const references: Reference[] = [];
    for (const reference of getReferencesText(vue)) {
        if (reference.pubmedId === 0) {
            references.push({ referenceText: reference.referenceText, pubmedId: 0 });
        } else {
            const splitedReferenceText = reference.referenceText.split(';');
            if (splitedReferenceText.length === 2) {
                // Split into context and pubmedId
                references.push({ referenceText: splitedReferenceText[1], pubmedId: reference.pubmedId });
            } else {
                references.push(reference);
            }
        }
    }

    return { context, references } as ContextAndReferences;
};

export const renderContextAndReferences = (contextAndReferences: ContextAndReferences): JSX.Element => {
    const { context, references } = contextAndReferences;

    // Separate references without links 
    const referencesWithoutLinkText = references
        .filter(ref => ref.pubmedId === 0)
        .map(ref => ref.referenceText)
        .join("; ");

    // References with links
    const referencesWithLinks = references.filter(ref => ref.pubmedId !== 0);
    return (
        <>
            {context && `${context} (`}
            {referencesWithoutLinkText && `${referencesWithoutLinkText}; `}
            {getLinks(referencesWithLinks)}
            {context && `)`}
        </>
    );
};


export const getHighestTherapeuticLevel = (vue: VUE) => {
    let highestTherapeuticLevel = "None";
    let highestLevel = Infinity;
    vue.revisedProteinEffects?.forEach(e => {
        if (e.therapeuticLevel && parseInt(e.therapeuticLevel.split('_')[1]) < highestLevel) {
            highestLevel = parseInt(e.therapeuticLevel.split('_')[1]);
            highestTherapeuticLevel = e.therapeuticLevel;
        }
    });
    return highestTherapeuticLevel;
}

export const getHighestOncogenicLevel = (vue: VUE) => {
    // Define the ranking: lower index = higher oncogenicity
    const ranking: Record<string, number> = {
        "Oncogenic": 1,
        "Likely Oncogenic": 2,
        "Predicted Oncogenic": 3,
        "Resistance": 4,
        "Likely Neutral": 5,
        "Predicted Neutral": 6,
        "Inconclusive": 7,
        "Unknown": 8,
        "None": 9
    };

    let highestOncogenicLevel = "None";
    let bestRank = ranking["None"];

    vue.revisedProteinEffects?.forEach(e => {
        const level = e.oncogenic ?? "None";
        const rank = ranking[level] ?? ranking["None"];
        if (rank < bestRank) {
            bestRank = rank;
            highestOncogenicLevel = level;
        }
    });

    return highestOncogenicLevel;
}

export const revisedProteinEffectSortingFn = (a: RevisedProteinEffect, b: RevisedProteinEffect) => {return (b.counts["mskimpact"].somaticVariantsCount + b.counts["mskimpact"].unknownVariantsCount) - (a.counts["mskimpact"].somaticVariantsCount + a.counts["mskimpact"].unknownVariantsCount)};
