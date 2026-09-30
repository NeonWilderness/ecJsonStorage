/**
 * ESJsonStorage class is a wrapper to the ExtendsClass JSON-Storage API
 */
type resGetBins = {
    status: 'ok';
    callsDone: number;
    callsRemaining: number;
    bins?: string[];
};
type resGetStats = Omit<resGetBins, 'bins'>;
type resGetBin = {
    status: 'ok';
    data: object;
};
type resUpdateBin = {
    status: 'ok';
    data: string;
};
type resPatchBin = resUpdateBin;
type resCreateBin = {
    status: 'ok';
    uri: string;
    bin: string;
};
type resDeleteBin = Omit<resGetBin, 'data'>;
type resError = {
    status: 'error';
    statusText: string;
};
declare class ECJsonStorage {
    url: string;
    apiKey: string;
    securityKey: string;
    monthlyLimit: number;
    constructor(apiKey: string, securityKey?: string, url?: string);
    /**
     * Utility function to validate the response after the class function call
     * @param response
     */
    validateResponse: (response: Response) => Promise<void>;
    /**
     * Get all bin IDs for a certain Api-key
     * @returns {object} <resGetBins | resError>
     */
    getBins: () => Promise<resGetBins | resError>;
    /**
     * Syntactic sugar function for getBins to only return limit counter
     * @returns {object} <resGetStats | resError>
     */
    getStats: () => Promise<resGetStats | resError>;
    /**
     * Reads the content of a certain bin ID
     * @param bin string Bin ID to read
     * @returns {object} <resGetBin | resError>
     */
    getBin: (bin: string) => Promise<resGetBin | resError>;
    /**
     * Creates a new bin and saves the given JSON payload to it
     * @param payload {object} JSON object to create the bin with
     * @param keepPrivate {boolean} TRUE=bin shall be kept private
     * @returns {object} <resCreateBin | resError>
     */
    createBin: (payload: object, keepPrivate: boolean) => Promise<resCreateBin | resError>;
    /**
     * Updates a certain bin with the given JSON object
     * @param payload {object} JSON object to update the bin with
     * @param bin string Bin ID to be updated
     * @returns {object} <resUpdateBin | resError>
     */
    updateBin: (payload: object, bin: string) => Promise<resUpdateBin | resError>;
    /**
     * Patches/inserts/changes a certain bin with the given JSON payload
     * ref: "Partially update JSON" at https://extendsclass.com/json-storage.html#apiDocumentation
     * @param payload {object} JSON object to patch the bin with
     * @param bin string Bin ID to be patched
     * @returns {object} <resPatchBin | resError>
     */
    patchBin: (payload: object, bin: string) => Promise<resPatchBin | resError>;
    /**
     * Deletes a certain bin
     * @param bin string Bin ID to be deleted
     * @returns {object} <resDeleteBin | resError>
     */
    deleteBin: (bin: string) => Promise<resDeleteBin | resError>;
}

export { ECJsonStorage, type resCreateBin, type resDeleteBin, type resError, type resGetBin, type resGetBins, type resGetStats, type resPatchBin, type resUpdateBin };
