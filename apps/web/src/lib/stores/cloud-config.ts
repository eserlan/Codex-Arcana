import { writable } from 'svelte/store';

interface CloudConfig {
    enabled: boolean;
    connectedEmail: string | null;
    shareStatus: 'private' | 'public';
    shareLink: string | null | undefined;
    gdriveFolderId?: string;
}

export const cloudConfig = writable<CloudConfig>({
    enabled: false,
    connectedEmail: null,
    shareStatus: 'private',
    shareLink: null
});