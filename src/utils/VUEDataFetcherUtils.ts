import { VUE } from "../model/VUE";

export const fetchVueData = async (): Promise<VUE[]> => {
    try {
        const response = await fetch(
            'https://raw.githubusercontent.com/knowledgesystems/reVUE-data/main/VUEs_all.json'
        );
        const json = await response.json();
        return json;
    } catch (error) {
        console.error('Error fetching JSON:', error);
        return [];
    }
};