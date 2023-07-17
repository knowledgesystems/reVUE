import { fetchVueData } from "../utils/VUEUtils";

export class DataStore {
    readonly data = fetchVueData();
}