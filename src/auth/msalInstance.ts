import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

// Create and export the MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);
