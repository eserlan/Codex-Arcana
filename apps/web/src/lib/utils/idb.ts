import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { LocalEntity } from "../stores/vault.svelte";

interface CodexDB extends DBSchema {
  settings: {
    key: string;
    value: any;
  };
  vault_cache: {
    key: string; // filePath
    value: {
      path: string;
      lastModified: number;
      entity: LocalEntity;
    };
  };
}

const DB_NAME = "CodexArcana";
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<CodexDB>>;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<CodexDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings");
        }
        if (!db.objectStoreNames.contains("vault_cache")) {
          db.createObjectStore("vault_cache", { keyPath: "path" });
        }
      },
    });
  }
  return dbPromise;
}

export async function getPersistedHandle(): Promise<FileSystemDirectoryHandle | null> {
  const db = await getDB();
  return (await db.get("settings", "lastVaultHandle")) || null;
}

export async function persistHandle(
  handle: FileSystemDirectoryHandle,
): Promise<void> {
  const db = await getDB();
  await db.put("settings", handle, "lastVaultHandle");
}

export async function clearPersistedHandle(): Promise<void> {
  const db = await getDB();
  await db.delete("settings", "lastVaultHandle");
}

// Cache Service methods
export async function getCachedFile(path: string) {
  const db = await getDB();
  return db.get("vault_cache", path);
}

export async function setCachedFile(
  path: string,
  lastModified: number,
  entity: LocalEntity,
) {
  const db = await getDB();
  
  // Clone entity to avoid structure clone errors with proxies or non-clonable fields if any
  // But LocalEntity is mostly plain JSON + _fsHandle.
  // _fsHandle IS clonable (FileSystemHandle is serializable to IDB).
  
  await db.put("vault_cache", { path, lastModified, entity });
}

export async function clearCache() {
  const db = await getDB();
  await db.clear("vault_cache");
}
