class GDriveStore {
    async shareFolderPublicly(): Promise<string | null> {
        return "mock-folder-id";
    }

    async revokeShare(): Promise<void> {
        return;
    }
}

export const gdrive = new GDriveStore();