class UIStore {
  // Existing state inferred from usage
  showSettings = $state(false);
  activeSettingsTab = $state("vault");
  globalError = $state<{ message: string; stack?: string } | null>(null);

  // New state for Read Mode
  readModeNodeId = $state<string | null>(null);

  toggleSettings(tab?: string) {
    if (tab) {
        this.activeSettingsTab = tab;
        this.showSettings = true;
    } else {
        this.showSettings = !this.showSettings;
    }
  }

  setGlobalError(message: string, stack?: string) {
    this.globalError = { message, stack };
  }

  clearGlobalError() {
    this.globalError = null;
  }

  openReadMode(nodeId: string) {
    this.readModeNodeId = nodeId;
  }

  closeReadMode() {
    this.readModeNodeId = null;
  }
}

export const uiStore = new UIStore();
// Export 'ui' as alias if needed for new components I wrote
export const ui = uiStore;