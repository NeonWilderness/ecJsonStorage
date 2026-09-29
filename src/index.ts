/**
 * ESJsonStorage class is a wrapper to the ExtendsClass JSON-Storage API
 */
export type resGetBins = {
  status: 'ok';
  callsDone: number;
  callsRemaining: number;
  bins?: string[];
};
export type resGetStats = Omit<resGetBins, 'bins'>;

export type resGetBin = {
  status: 'ok';
  data: object;
};

export type resUpdateBin = {
  status: 'ok';
  data: string;
};
export type resPatchBin = resUpdateBin;

export type resCreateBin = {
  status: 'ok';
  uri: string;
  bin: string;
};

export type resDeleteBin = Omit<resGetBin, 'data'>;

export type resError = {
  status: 'error';
  statusText: string;
};

export class ECJsonStorage {
  url: string;
  apiKey: string;
  securityKey: string;
  monthlyLimit: number = 10000;

  constructor(apiKey: string, securityKey?: string, url?: string) {
    this.url = url || 'https://json.extendsclass.com/bin';
    this.apiKey = apiKey || '';
    this.securityKey = securityKey || '';

    if (!this.url || !this.apiKey) throw new Error('Invalid constructor params!');
    while (this.url.endsWith('/')) {
      this.url = this.url.slice(0, -1);
    }
  }

  /**
   * Utility function to validate the response after the class function call
   * @param response
   */
  validateResponse = async (response: Response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.startsWith('text/html')) {
      throw new Error(`Expected JSON but server returned HTML: "${(await response.text()).slice(0, 100)}..."`);
    }
  };

  /**
   * Get all bin IDs for a certain Api-key
   * @returns {object} <resGetBins | resError>
   */
  getBins = async (): Promise<resGetBins | resError> => {
    try {
      const response = await fetch(`${this.url}s`, {
        method: 'GET',
        headers: {
          'Api-key': this.apiKey,
          Accept: 'application/json'
        }
      });

      await this.validateResponse(response);

      const counter = Number(response.headers.get('x-counter'));
      const data = await response.json();
      return {
        status: 'ok',
        callsDone: counter,
        callsRemaining: this.monthlyLimit - counter,
        bins: data
      };
    } catch (error) {
      console.error('getBins error:', error);
      return {
        status: 'error',
        statusText: <string>error
      };
    }
  };

  /**
   * Syntactic sugar function for getBins to only return limit counter
   * @returns {object} <resGetStats | resError>
   */
  getStats = async (): Promise<resGetStats | resError> => {
    try {
      const res = await this.getBins();
      if (res.status === 'error') {
        throw new Error(`HTTP error! Status: ${(<resError>res).statusText}`);
      }

      delete (<resGetBins>res).bins;
      return <resGetStats>res;
    } catch (error) {
      console.error('getStats error:', error);
      return {
        status: 'error',
        statusText: <string>error
      };
    }
  };

  /**
   * Reads the content of a certain bin ID
   * @param bin string Bin ID to read
   * @returns {object} <resGetBin | resError>
   */
  getBin = async (bin: string): Promise<resGetBin | resError> => {
    try {
      if (!bin) throw new Error('Bin ID missing!');
      const response = await fetch(`${this.url}/${bin}`, {
        method: 'GET',
        headers: {
          'Security-key': this.securityKey,
          Accept: 'application/json'
        }
      });

      await this.validateResponse(response);

      const data = await response.json();
      return {
        status: 'ok',
        data
      };
    } catch (error) {
      console.error('getBin error:', error);
      return {
        status: 'error',
        statusText: <string>error
      };
    }
  };

  /**
   * Creates a new bin and saves the given JSON payload to it
   * @param payload {object} JSON object to create the bin with
   * @param keepPrivate {boolean} TRUE=bin shall be kept private
   * @returns {object} <resCreateBin | resError>
   */
  createBin = async (payload: object, keepPrivate: boolean): Promise<resCreateBin | resError> => {
    const headers = new Headers({
      'Api-key': this.apiKey,
      'Security-key': this.securityKey,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });
    headers.append('Private', keepPrivate.toString());
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      await this.validateResponse(response);

      let { uri, bin } = await response.json();
      if (!bin) bin = uri.split('/').pop();

      return {
        status: 'ok',
        uri,
        bin
      };
    } catch (error) {
      console.error('createBin error:', error);
      return {
        status: 'error',
        statusText: <string>error
      };
    }
  };

  /**
   * Updates a certain bin with the given JSON object
   * @param payload {object} JSON object to update the bin with
   * @param bin string Bin ID to be updated
   * @returns {object} <resUpdateBin | resError>
   */
  updateBin = async (payload: object, bin: string): Promise<resUpdateBin | resError> => {
    try {
      const response = await fetch(`${this.url}/${bin}`, {
        method: 'PUT',
        headers: {
          'Security-key': this.securityKey,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      await this.validateResponse(response);

      const { data } = await response.json();
      return {
        status: 'ok',
        data
      };
    } catch (error) {
      console.error('updateBin error:', error);
      return {
        status: 'error',
        statusText: <string>error
      };
    }
  };

  /**
   * Patches/inserts/changes a certain bin with the given JSON payload
   * ref: "Partially update JSON" at https://extendsclass.com/json-storage.html#apiDocumentation
   * @param payload {object} JSON object to patch the bin with
   * @param bin string Bin ID to be patched
   * @returns {object} <resPatchBin | resError>
   */
  patchBin = async (payload: object, bin: string): Promise<resPatchBin | resError> => {
    try {
      const response = await fetch(`${this.url}/${bin}`, {
        method: 'PATCH',
        headers: {
          'Security-key': this.securityKey,
          'Content-Type': 'application/merge-patch+json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      await this.validateResponse(response);

      const { data } = await response.json();
      return {
        status: 'ok',
        data
      };
    } catch (error) {
      console.error('patchBin error:', error);
      return {
        status: 'error',
        statusText: <string>error
      };
    }
  };

  /**
   * Deletes a certain bin
   * @param bin string Bin ID to be deleted
   * @returns {object} <resDeleteBin | resError>
   */
  deleteBin = async (bin: string): Promise<resDeleteBin | resError> => {
    try {
      const response = await fetch(`${this.url}/${bin}`, {
        method: 'DELETE',
        headers: {
          'Security-key': this.securityKey,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });

      await this.validateResponse(response);

      const { status } = await response.json();
      if (status !== 0) throw new Error(`Bin delete failed with error: ${status.message}`);

      return {
        status: 'ok'
      };
    } catch (error) {
      console.error('deleteBin error:', error);
      return {
        status: 'error',
        statusText: <string>error
      };
    }
  };
}
