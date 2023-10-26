import { VUE } from "../model/VUE";

export const fetchVueData = async (): Promise<VUE[]> => {
    try {
        const response = await fetch(
            'https://raw.githubusercontent.com/knowledgesystems/reVUE-data/8a1f030ed47b7ec044192117bbbcf71ec528cbd7/VUEs.json'
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

    const links = uniqueReferences.map((reference, i) => 
        (
            <>
                <a href={`https://pubmed.ncbi.nlm.nih.gov/${reference.pubmedId}/`} rel="noreferrer" target="_blank">
                    ({reference.referenceText})
                </a>
                {(i !== uniqueReferences.length - 1) && ', '}
            </>
        )
    )

    return links;
}
