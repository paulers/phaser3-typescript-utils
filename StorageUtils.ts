namespace Utils {

  export interface ISponsorStorage {
    /**
     * Sponsor-specific save method
     * @param key Key under which to save the content
     * @param data Content to save to the storage
     */
    save(key: string, data: any): Promise<void>;
    /**
     * Sponsor-specific load method
     * @param key Key under which the content resides
     */
    load(key: string): Promise<any>;
    /**
     * If true, use sponsor storage if available, then fall back to standard storage.
     * If false, use only sponsor storage.
     */
    fallbackToStandardStorage(): boolean;
  }

  export class StorageUtils {

    private static _sponsorStorage: ISponsorStorage = null;
    private static _allowMultipleRequests: boolean = false;
    private static _requestsCounter: number = 0;

    public static set sponsorStorage(sponsorStorage: ISponsorStorage) {
      StorageUtils._sponsorStorage = sponsorStorage;
    }

    public static set allowMultipleRequests(allowMultipleRequests: boolean) {
      StorageUtils._allowMultipleRequests = allowMultipleRequests;
    }

    public static async save(key: string, data: any): Promise<any> {
      // check if any load/save request is still running
      if (!StorageUtils._allowMultipleRequests && StorageUtils._requestsCounter > 0) {
        throw new Error("Previous load/save request was not finished yet");
      }
      ++StorageUtils._requestsCounter;

      // sponsor specific storage?
      let sponsorStorage = StorageUtils._sponsorStorage;
      if (sponsorStorage !== null) {
        // save
        await sponsorStorage.save(key, data);

        // end here if fallback to local is disabled
        if (!sponsorStorage.fallbackToStandardStorage()) {
          --StorageUtils._requestsCounter;
          return;
        }
      }

      // local storage
      let storage = StorageUtils.getLocalStorage();

      if (storage !== null) {
        let dataString = JSON.stringify(data);
        storage.setItem(key, dataString);
      } else {
        --StorageUtils._requestsCounter;
        throw new Error("Local storage not available");
      }

      --StorageUtils._requestsCounter;
    }

    public static async load(key: string): Promise<any> {
      // check if any load/save request is still running
      if (!StorageUtils._allowMultipleRequests && StorageUtils._requestsCounter > 0) {
        throw new Error("Previous load/save request was not finished yet");
      }
      ++StorageUtils._requestsCounter;

      let data = null;

      // sponsor specific storage?
      let sponsorStorage = StorageUtils._sponsorStorage;
      if (sponsorStorage !== null) {
          // load
          data = await sponsorStorage.load(key);

          // if got some data (not null or undefined) or fallback to standard storage not not allowed
          if (data != null || !sponsorStorage.fallbackToStandardStorage()) {
              --StorageUtils._requestsCounter;
              return data;
          }
      }


      // standard storage
      let storage = StorageUtils.getLocalStorage();

      if (storage !== null) {
          let dataString = storage.getItem(key);
          data = JSON.parse(dataString);

      } else {
          --StorageUtils._requestsCounter;
          throw new Error("Standard storage not available");
      }
      --StorageUtils._requestsCounter;

      return data;
    }

    private static getLocalStorage(): Storage {
      try {
        if ("localStorage" in window && window["localStorage"] != null) {
          return localStorage;
        }
      } catch (e) {
        return null;
      }

      return null;
  }
  }
}