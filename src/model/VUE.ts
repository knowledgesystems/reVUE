export type VUE = {
    hugoGeneSymbol: string;
    transcriptId: string;
    genomicLocationDescription: string;
    defaultEffect: string;
    comment: string;
    context: string;
    revisedProteinEffects: RevisedProteinEffect[];
};

export type RevisedProteinEffect = {
    variant: string;
    genomicLocation: string;
    transcriptId: string;
    vepPredictedProteinEffect: string;
    vepPredictedVariantClassification: string;
    revisedProteinEffect: string;
    revisedVariantClassification: string;
    mutationOrigin: string,
    references: Reference[];
    germlineVariantsCount: number;
    somaticVariantsCount: number;
    unknownMutationStatusVariantsCount: number;
    confirmed: boolean;
    variantNote: string;
    counts: {[cohort: string]: {
        germlineVariantsCount: number;
        somaticVariantsCount: number;
        unknownVariantsCount: number;
        totalPatientCount: number;
        genePatientCount: number;
        germlineVariantsCountByCancerType: {};
        somaticVariantsCountByCancerType: {};
        unknownVariantsCountByCancerType: {};
    }};
    therapeuticLevel: string;
}

export type Reference = {
    referenceText: string;
    pubmedId: number;
}