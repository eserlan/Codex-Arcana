import type { ICloudAdapter, RemoteFileMeta } from "../index";

const getGoogleConfig = () => ({
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  SCOPES: "https://www.googleapis.com/auth/drive.file",
  DISCOVERY_DOC: "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
});

export class GoogleDriveAdapter implements ICloudAdapter {
  private tokenClient!: google.accounts.oauth2.TokenClient;
  private accessToken: string | null = null;
  private gapiInited = false;
  private gisInited = false;

  constructor() {
    this.initGis();
    this.initGapi();
  }

  private initGis() {
    if (typeof google !== "undefined" && google.accounts) {
      const { CLIENT_ID, SCOPES } = getGoogleConfig();
      if (!CLIENT_ID) {
        console.warn("VITE_GOOGLE_CLIENT_ID is missing. Google Drive integration disabled.");
        return;
      }
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (resp: google.accounts.oauth2.TokenResponse) => {
          if (resp.error) {
            throw resp;
          }
          this.accessToken = resp.access_token;
        },
      });
      this.gisInited = true;
    }
  }

  isConfigured(): boolean {
    return !!getGoogleConfig().CLIENT_ID;
  }

  private async initGapi() {
    // Wait for gapi to be loaded
    if (typeof gapi !== "undefined") {
      await new Promise<void>((resolve) => gapi.load("client", resolve));
      await gapi.client.init({
        discoveryDocs: [getGoogleConfig().DISCOVERY_DOC],
      });
      this.gapiInited = true;
    }
  }

  async connect(): Promise<string> {
    if (!this.gisInited) this.initGis();
    if (!this.gapiInited) await this.initGapi();

    return new Promise((resolve, reject) => {
      if (!this.tokenClient) {
        reject(new Error("Google Identity Services not initialized (missing Client ID?)"));
        return;
      }
      (this.tokenClient as any).callback = async (
        resp: google.accounts.oauth2.TokenResponse,
      ) => {
        if (resp.error) {
          reject(resp);
          return;
        }
                  this.accessToken = resp.access_token;
                  
                  // Explicitly set the token in gapi so it's globally available to workerBridge
                  if (typeof gapi !== 'undefined' && gapi.client) {
                    gapi.client.setToken(resp);
                  }
        
                  try {          // 1. Get user info
          const about = await gapi.client.drive.about.get({
            fields: "user(emailAddress)",
          });
          const email = about.result.user?.emailAddress || "connected-user";

          // 2. Ensure CodexArcana folder exists
          let folderId = await this.getFolderId();
          if (!folderId) {
            folderId = await this.createFolder("CodexArcana");
          }
          
          // Store folder ID in localStorage for the worker to use later
          localStorage.setItem('gdrive_folder_id', folderId);

          resolve(email);
        } catch (e) {
          console.warn("Failed to complete GDrive setup", e);
          resolve("connected-user");
        }
      };

      if (gapi.client.getToken() === null) {
        this.tokenClient.requestAccessToken({ prompt: "consent" });
      } else {
        this.tokenClient.requestAccessToken({ prompt: "" });
      }
    });
  }

  private async getFolderId(): Promise<string | null> {
    const response = await gapi.client.drive.files.list({
      q: "name = 'CodexArcana' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
      fields: "files(id)",
    });
    const files = response.result.files;
    return files && files.length > 0 ? files[0].id! : null;
  }

  private async createFolder(name: string): Promise<string> {
    const response = await gapi.client.drive.files.create({
      resource: {
        name: name,
        mimeType: "application/vnd.google-apps.folder",
      },
      fields: "id",
    });
    return response.result.id!;
  }

  getAccessToken(): string | null {
    return this.accessToken || gapi.client.getToken()?.access_token || null;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  async disconnect(): Promise<void> {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token, () => { });
      gapi.client.setToken(null);
      this.accessToken = null;
      localStorage.removeItem('gdrive_folder_id');
    }
  }

  async listFiles(): Promise<Map<string, RemoteFileMeta>> {
    if (!this.accessToken) throw new Error("Not authenticated");
    const folderId = localStorage.getItem('gdrive_folder_id');
    if (!folderId) throw new Error("No sync folder found. Reconnect requested.");

    const response = await gapi.client.drive.files.list({
      pageSize: 1000,
      fields: "files(id, name, mimeType, modifiedTime, parents, appProperties)",
      q: `'${folderId}' in parents and trashed = false`,
    });

    const fileMap = new Map<string, RemoteFileMeta>();
    const files = response.result.files;

    if (files && files.length > 0) {
      for (const file of files) {
        if (file.name && file.id) {
          fileMap.set(file.name, {
            id: file.id,
            name: file.name,
            mimeType: file.mimeType || "",
            modifiedTime: file.modifiedTime || "",
            parents: file.parents || [],
          });
        }
      }
    }
    return fileMap;
  }

  async uploadFile(
    _path: string, // eslint-disable-line @typescript-eslint/no-unused-vars
    _content: string | Blob, // eslint-disable-line @typescript-eslint/no-unused-vars
    _existingId?: string, // eslint-disable-line @typescript-eslint/no-unused-vars
  ): Promise<RemoteFileMeta> {
    if (!this.accessToken) throw new Error("Not authenticated");
    // Simplified upload logic for MVP
    // Real impl needs multipart upload for metadata + content
    throw new Error("Not implemented");
  }

  async downloadFile(fileId: string): Promise<string> {
    if (!this.accessToken) throw new Error("Not authenticated");
    const response = await gapi.client.drive.files.get({
      fileId: fileId,
      alt: "media",
    });
    return response.body;
  }

  async deleteFile(fileId: string): Promise<void> {
    if (!this.accessToken) throw new Error("Not authenticated");
    await gapi.client.drive.files.delete({ fileId: fileId });
  }
}
