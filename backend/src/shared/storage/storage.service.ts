export interface IStorageService {
    save(base64DataUrl: string, userId: string): Promise<string>;
    toUrl(stored: string): string;
}

export class LocalBase64StorageService implements IStorageService {
    async save(base64DataUrl: string, _userId: string): Promise<string> {
        return base64DataUrl;
    }

    toUrl(stored: string): string {
        return stored;
    }
}

// Singleton — swap implementation here to migrate to S3
export const storageService: IStorageService = new LocalBase64StorageService();
