import { LogLevel } from "@azure/msal-browser";
import type { Configuration, PopupRequest } from "@azure/msal-browser";

import { getEnv } from "@/utils/envWrapper";

export const msalConfig: Configuration = {
    auth: {
        clientId: getEnv('VITE_CLIENT_ID'),
        authority: `https://login.microsoftonline.com/${getEnv('VITE_TENANT_ID')}`,
        redirectUri: getEnv('VITE_REDIRECT_URI'),
    },
    cache: {
        cacheLocation: "localStorage", // Store tokens in localStorage
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            },
        },
    },
};

export const loginRequest: PopupRequest = {
    scopes: ["User.Read", getEnv('VITE_API_SCOPE')],
};

export const apiConfig = {
    baseUrl: getEnv('VITE_API_BASE'),
    scopes: [getEnv('VITE_API_SCOPE')],
};
