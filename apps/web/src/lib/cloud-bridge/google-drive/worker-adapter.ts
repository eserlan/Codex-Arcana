import type { ICloudAdapter, RemoteFileMeta } from "../index";

const API_BASE = "https://www.googleapis.com/drive/v3/files";
const UPLOAD_BASE = "https://www.googleapis.com/upload/drive/v3/files";

export class WorkerDriveAdapter implements ICloudAdapter {
  constructor(private accessToken: string, private folderId?: string) {}

  async connect(): Promise<string> {
    return "connected-via-token";
  }

  async disconnect(): Promise<void> {
    // No-op for worker adapter
  }

  async listFiles(): Promise<RemoteFileMeta[]> {
    if (!this.folderId) throw new Error("WorkerDriveAdapter: folderId is required");
    const url = new URL(API_BASE);
    url.searchParams.append("pageSize", "1000");
    url.searchParams.append(
      "fields",
      "files(id, name, mimeType, modifiedTime, parents, appProperties)",
    );
    url.searchParams.append(
      "q",
      `'${this.folderId}' in parents and trashed = false`,
    );

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });

    if (!res.ok) throw new Error(`GDrive List Error: ${res.statusText}`);
    const data = await res.json();

    const remoteFiles: RemoteFileMeta[] = [];
    if (data.files) {
      for (const file of data.files) {
        remoteFiles.push({
          id: file.id,
          name: file.name,
          mimeType: file.mimeType || "",
          modifiedTime: file.modifiedTime || "",
          parents: file.parents || [],
          appProperties: file.appProperties,
        });
      }
    }
    return remoteFiles;
  }

  private getMimeType(path: string): string {
    const ext = path.split(".").pop()?.toLowerCase();
    if (!ext || ext === path.toLowerCase()) {
      return "application/octet-stream";
    }
    switch (ext) {
      case "md":
        return "text/markdown";
      case "png":
        return "image/png";
      case "webp":
        return "image/webp";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "json":
        return "application/json";
      default:
        return "application/octet-stream";
    }
  }

  async uploadFile(
    path: string,
    content: string | Blob,
    existingId?: string,
  ): Promise<RemoteFileMeta> {
    if (!this.folderId)
      throw new Error("WorkerDriveAdapter: folderId is required");

    const mimeType = this.getMimeType(path);
    const metadata = {
      name: path.split("/").filter(Boolean).pop() || "unknown",
      mimeType: mimeType,
      parents: existingId ? undefined : [this.folderId],
      appProperties: {
        vault_path: path,
      },
    };

    // Resumable upload Step 1: Initialize session
    const method = existingId ? "PATCH" : "POST";
    const baseUrl = existingId ? `${UPLOAD_BASE}/${existingId}` : UPLOAD_BASE;
    const initUrl = new URL(baseUrl);
    initUrl.searchParams.append("uploadType", "resumable");

    const initRes = await fetch(initUrl.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": mimeType,
      },
      body: JSON.stringify(metadata),
    });

    if (!initRes.ok) {
      const errorText = await initRes.text();
      throw new Error(`GDrive Upload Session Error: ${initRes.statusText} - ${errorText}`);
    }

    const sessionUri = initRes.headers.get("Location");
    if (!sessionUri) {
      throw new Error("GDrive Upload Error: No Location header returned for resumable session");
    }

    // Step 2: Upload the actual content to the session URI
    const contentBlob =
      content instanceof Blob ? content : new Blob([content], { type: mimeType });

    const uploadRes = await fetch(sessionUri, {
      method: "PUT",
      body: contentBlob,
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      throw new Error(`GDrive Content Upload Error: ${uploadRes.statusText} - ${errorText}`);
    }

    const file = await uploadRes.json();

    return {
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      modifiedTime: file.modifiedTime,
      parents: file.parents,
      appProperties: file.appProperties,
    };
  }

  async downloadFile(fileId: string): Promise<Blob> {
    const url = `${API_BASE}/${fileId}?alt=media`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    if (!res.ok) throw new Error(`GDrive Download Error: ${res.statusText}`);
    return res.blob();
  }

  async deleteFile(fileId: string): Promise<void> {
    const url = `${API_BASE}/${fileId}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    if (!res.ok) throw new Error(`GDrive Delete Error: ${res.statusText}`);
  }
}
