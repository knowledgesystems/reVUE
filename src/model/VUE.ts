export type VUE = {
    hugoGeneSymbol: string;
    transcriptId: string;
    genomicLocationDescription: string;
    defaultEffect: string;
    comment: string;
    context: string;
    revisedProteinEffects: {
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
    }[];
};
