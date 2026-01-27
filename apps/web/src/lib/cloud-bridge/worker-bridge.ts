import SyncWorker from "$workers/sync?worker";
import { cloudConfig } from "$stores/cloud-config";
import { get } from "svelte/store";
import { GoogleDriveAdapter } from "./google-drive/adapter";
import { vault } from "$lib/stores/vault.svelte";
import { browser } from "$app/environment";
import type { CloudConfig } from "./index";

export class WorkerBridge {
  private worker: Worker;
  private gdriveAdapter: GoogleDriveAdapter;
  private syncIntervalId: any;
  private unsubscribers: (() => void)[] = [];

  constructor() {
    this.worker = new SyncWorker();
    this.gdriveAdapter = new GoogleDriveAdapter();
    this.setupListeners();

    if (browser) {
      // Setup periodic sync based on config only if enabled
      const unsub = cloudConfig.subscribe((config: CloudConfig) => {
        if (this.syncIntervalId) clearInterval(this.syncIntervalId);
        if (config.enabled && config.syncInterval > 0) {
          this.syncIntervalId = setInterval(
            () => this.startSync(),
            config.syncInterval,
          );
        }
      });
      this.unsubscribers.push(unsub);
    }
  }

  public destroy() {
    this.unsubscribers.forEach(u => u());
    if (this.syncIntervalId) clearInterval(this.syncIntervalId);
    this.worker.terminate();
  }

  private setupListeners() {
    // ... same ...
  }

  async startSync() {
    const config = get(cloudConfig) as CloudConfig;
    if (!config.enabled) return;

    if (!this.gdriveAdapter.isAuthenticated()) return;

    const token = gapi.client.getToken()?.access_token;
    const email = config.connectedEmail;
    const storageKey = `gdrive_folder_id:${email}`;
    const folderId = localStorage.getItem(storageKey);
    const rootHandle = vault.rootHandle;

    if (token) {
      // Send single initialization + start command to avoid race condition
      this.worker.postMessage({
        type: "INIT_SYNC",
        payload: { 
          accessToken: token,
          folderId: folderId || undefined,
          rootHandle: rootHandle
        },
      });
      this.worker.postMessage({ type: "START_SYNC" });
    }
  }
}

export const workerBridge = new WorkerBridge();
