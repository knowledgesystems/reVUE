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
    pubmedId: number;
    referenceText: string;
    germlineVariantsCount: number;
    somaticVariantsCount: number;
    unknownMutationStatusVariantsCount: number;
    confirmed: boolean;
    counts: {[cohort: string]: {
        germlineVariantsCount: number;
        somaticVariantsCount: number;
        unknownVariantsCount: number;
        totalPatientCount: number;
        genePatientCount: number;
    }}
}
