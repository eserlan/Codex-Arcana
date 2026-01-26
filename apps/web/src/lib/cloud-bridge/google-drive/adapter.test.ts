import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("$env/static/public", () => ({
  VITE_GOOGLE_CLIENT_ID: "fake-client-id"
}));

// Mock import.meta.env
(import.meta.env as any).VITE_GOOGLE_CLIENT_ID = "fake-client-id";

import { GoogleDriveAdapter } from "./adapter";

// Mock the global google object
const mockTokenClient = {
  callback: null as any,
  requestAccessToken: vi.fn(),
};

const mockGoogle = {
  accounts: {
    oauth2: {
      initTokenClient: vi.fn().mockImplementation(() => ({
        callback: null,
        requestAccessToken: vi.fn(),
      })),
      hasGrantedAllScopes: vi.fn().mockReturnValue(true),
    },
  },
};

const mockGapi = {
  load: vi.fn((name, cb) => cb()),
  client: {
    init: vi.fn().mockResolvedValue({}),
    getToken: vi.fn().mockReturnValue(null),
  },
};

vi.stubGlobal("google", mockGoogle);
vi.stubGlobal("gapi", mockGapi);

describe("GoogleDriveAdapter Auth", () => {
  let adapter: GoogleDriveAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new GoogleDriveAdapter();
  });

  it("should initialize token client on construction or connect", () => {
    expect(mockGoogle.accounts.oauth2.initTokenClient).toHaveBeenCalled();
  });

  it("should request access token when connect is called", async () => {
    const connectPromise = adapter.connect();

    // Get the dynamically created token client from the last call
    const tokenClient = vi.mocked(mockGoogle.accounts.oauth2.initTokenClient).mock.results[0].value;

    // Simulate callback
    expect(tokenClient.requestAccessToken).toHaveBeenCalled();
    // In connect(), the callback is reassigned on the tokenClient
    tokenClient.callback({ access_token: "fake-token" });

    await connectPromise;
    expect(adapter.isAuthenticated()).toBe(true);
  });
});
