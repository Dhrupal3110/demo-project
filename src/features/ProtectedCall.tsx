import React, { useState } from 'react';
import { useMsal } from "@azure/msal-react";
import { callApiWithToken } from "@/auth/apiClient";
import { PublicClientApplication } from "@azure/msal-browser";

const ProtectedCall: React.FC = () => {
    const { instance, accounts } = useMsal();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Cast instance to PublicClientApplication as useMsal returns IPublicClientApplication
            const result = await callApiWithToken(
                instance as PublicClientApplication, 
                accounts[0], 
                "/protected-endpoint" // Example endpoint
            );
            setData(result);
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-lg mx-auto mt-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Protected API Call</h2>
            <div className="mb-6 text-gray-600 dark:text-gray-300">
                This component demonstrates calling a protected API endpoint using an access token acquired silently (or via popup).
            </div>

            <button
                onClick={fetchData}
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md font-semibold text-white transition-colors 
                    ${loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
            >
                {loading ? 'Fetching...' : 'Call Protected API'}
            </button>

            {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-200 rounded-md text-sm border border-red-200 dark:border-red-800">
                    Error: {error}
                </div>
            )}

            {data && (
                <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">API Response</h3>
                    <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-x-auto text-sm text-gray-800 dark:text-gray-200 font-mono border border-gray-200 dark:border-gray-700">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default ProtectedCall;
