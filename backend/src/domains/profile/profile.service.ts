import { ProfileRepository } from './profile.repository.ts';
import { storageService } from '../../shared/storage/storage.service.ts';

export class ProfileService {
    constructor(private readonly repo: ProfileRepository) {}

    async getProfile(userId: string) {
        const profile = await this.repo.findByUserId(userId);
        if (!profile) return null;
        return {
            ...profile,
            logoUrl: profile.logoStorage ? storageService.toUrl(profile.logoStorage) : null,
        };
    }

    async updateProfile(userId: string, data: {
        name?: string;
        document?: string;
        phone?: string;
        address?: string;
        brandColor?: string;
    }) {
        return this.repo.upsert(userId, data);
    }

    async updateLogo(userId: string, base64DataUrl: string) {
        const stored = await storageService.save(base64DataUrl, userId);
        await this.repo.upsert(userId, { logoStorage: stored });
        return { logoUrl: storageService.toUrl(stored) };
    }
}
