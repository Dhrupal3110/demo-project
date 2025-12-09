import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { configureStore } from '@reduxjs/toolkit';
import stepperReducer from '@/features/sidebarStepper/stepperSlice';
import programReducer from '@/features/selectProgram/programSlice';

export const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            gcTime: 0,
        },
    },
});

export const createTestStore = (preloadedState = {}) => configureStore({
    reducer: {
        stepper: stepperReducer,
        program: programReducer,
    },
    preloadedState,
});

export const createWrapper = () => {
    const queryClient = createTestQueryClient();
    const store = createTestStore();

    return ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <BrowserRouter>
                        {children}
                    </BrowserRouter>
                </ThemeProvider>
            </QueryClientProvider>
        </Provider>
    );
};
