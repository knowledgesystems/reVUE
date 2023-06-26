export type VUE = {
    hugoGeneSymbol: string;
    genomicLocation: string;
    defaultEffect: string;
    comment: string;
    pubmedIds: number[];
    context: string;
    referenceText: string;
    revisedProteinEffects: {
        variant: string;
        transcriptId: string;
        revisedProteinEffect: string;
        variantClassification: string;
    };
};
  