import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { ThemeProvider, QueryProvider } from '@/app/providers';
import { Toaster } from 'react-hot-toast';

// MSAL Imports
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from '@/auth/authConfig';

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Initialize application
msalInstance.initialize().then(() => {
    // Account selection logic - MUST be after initialization
    if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
        msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
    }

    // Event callback
    msalInstance.addEventCallback((event) => {
        if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
            const account = event.payload as any;
            msalInstance.setActiveAccount(account);
        }
    });

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <Provider store={store}>
            <QueryProvider>
                <ThemeProvider>
                    <BrowserRouter>
                        <MsalProvider instance={msalInstance}>
                            <App />
                            <Toaster
                                position="top-center"
                                toastOptions={{
                                    style: {
                                        borderRadius: '8px',
                                        padding: '12px',
                                    },
                                }}
                            />
                        </MsalProvider>
                    </BrowserRouter>
                </ThemeProvider>
            </QueryProvider>
        </Provider>
    );
});
