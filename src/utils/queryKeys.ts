export const queryKeys = {
    programs: {
        all: ['programs'] as const,
        lists: () => [...queryKeys.programs.all, 'list'] as const,
        list: (params: any) => [...queryKeys.programs.lists(), params] as const,
        details: () => [...queryKeys.programs.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.programs.details(), id] as const,
        search: (query: string) => [...queryKeys.programs.all, 'search', query] as const,
        recent: (limit: number) => [...queryKeys.programs.all, 'recent', limit] as const,
    },
    databases: {
        all: ['databases'] as const,
        lists: () => [...queryKeys.databases.all, 'list'] as const,
        list: (params: any) => [...queryKeys.databases.lists(), params] as const,
        details: () => [...queryKeys.databases.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.databases.details(), id] as const,
        detailsByIds: (ids: string[]) => [...queryKeys.databases.details(), 'ids', ids] as const,
        search: (query: string) => [...queryKeys.databases.all, 'search', query] as const,
        stats: () => [...queryKeys.databases.all, 'stats'] as const,
        byStatus: (status: string) => [...queryKeys.databases.all, 'status', status] as const,
    },
    portfolios: {
        all: ['portfolios'] as const,
        databases: () => [...queryKeys.portfolios.all, 'databases'] as const,
        detail: (id: string) => [...queryKeys.portfolios.all, 'detail', id] as const,
        search: (query: string) => [...queryKeys.portfolios.all, 'search', query] as const,
    },
    treaties: {
        all: ['treaties'] as const,
        databases: () => [...queryKeys.treaties.all, 'databases'] as const,
        byDatabase: (id: string) => [...queryKeys.treaties.all, 'byDatabase', id] as const,
        search: (query: string) => [...queryKeys.treaties.all, 'search', query] as const,
    },
    stepper: {
        all: ['stepper'] as const,
        formData: () => [...queryKeys.stepper.all, 'formData'] as const,
        step: (stepId: number) => [...queryKeys.stepper.all, 'step', stepId] as const,
    },
    demandSurge: {
        all: ['demandSurge'] as const,
        items: () => [...queryKeys.demandSurge.all, 'items'] as const,
        search: (db: string, port: string) => [...queryKeys.demandSurge.all, 'search', db, port] as const,
    },
    // Add other keys as needed
};
