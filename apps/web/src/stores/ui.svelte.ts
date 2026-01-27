class UIStore {
    showSettings = $state(false);

    openSettings() {
        this.showSettings = true;
    }

    closeSettings() {
        this.showSettings = false;
    }

    toggleSettings() {
        this.showSettings = !this.showSettings;
    }
}

export const uiStore = new UIStore();
