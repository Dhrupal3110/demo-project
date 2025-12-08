import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import type { AccountInfo } from "@azure/msal-browser";
import { apiConfig } from "./authConfig";

export const callApiWithToken = async (
    instance: PublicClientApplication,
    account: AccountInfo,
    endpoint: string,
    options: RequestInit = {}
) => {
    const request = {
        scopes: apiConfig.scopes,
        account: account,
    };

    let accessToken = "";

    try {
        const response = await instance.acquireTokenSilent(request);
        accessToken = response.accessToken;
    } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
            const response = await instance.acquireTokenPopup(request);
            accessToken = response.accessToken;
        } else {
            console.error(error);
            throw error;
        }
    }

    const headers = new Headers(options.headers);
    headers.append("Authorization", `Bearer ${accessToken}`);

    const fetchOptions: RequestInit = {
        ...options,
        headers: headers,
    };

    const response = await fetch(`${apiConfig.baseUrl}${endpoint}`, fetchOptions);

    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
};
