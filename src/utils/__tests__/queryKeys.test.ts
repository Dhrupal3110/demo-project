import { queryKeys } from '../queryKeys';

describe('queryKeys', () => {
    describe('programs', () => {
        it('generates correct keys', () => {
            expect(queryKeys.programs.all).toEqual(['programs']);
            expect(queryKeys.programs.lists()).toEqual(['programs', 'list']);
            expect(queryKeys.programs.list({ page: 1 })).toEqual(['programs', 'list', { page: 1 }]);
            expect(queryKeys.programs.details()).toEqual(['programs', 'detail']);
            expect(queryKeys.programs.detail('1')).toEqual(['programs', 'detail', '1']);
            expect(queryKeys.programs.search('query')).toEqual(['programs', 'search', 'query']);
            expect(queryKeys.programs.recent(5)).toEqual(['programs', 'recent', 5]);
        });
    });

    describe('databases', () => {
        it('generates correct keys', () => {
            expect(queryKeys.databases.all).toEqual(['databases']);
            expect(queryKeys.databases.lists()).toEqual(['databases', 'list']);
            expect(queryKeys.databases.list({ page: 1 })).toEqual(['databases', 'list', { page: 1 }]);
            expect(queryKeys.databases.details()).toEqual(['databases', 'detail']);
            expect(queryKeys.databases.detail('1')).toEqual(['databases', 'detail', '1']);
            expect(queryKeys.databases.detailsByIds(['1', '2'])).toEqual(['databases', 'detail', 'ids', ['1', '2']]);
            expect(queryKeys.databases.search('query')).toEqual(['databases', 'search', 'query']);
            expect(queryKeys.databases.stats()).toEqual(['databases', 'stats']);
            expect(queryKeys.databases.byStatus('active')).toEqual(['databases', 'status', 'active']);
        });
    });

    describe('portfolios', () => {
        it('generates correct keys', () => {
            expect(queryKeys.portfolios.all).toEqual(['portfolios']);
            expect(queryKeys.portfolios.databases()).toEqual(['portfolios', 'databases']);
            expect(queryKeys.portfolios.detail('1')).toEqual(['portfolios', 'detail', '1']);
            expect(queryKeys.portfolios.search('query')).toEqual(['portfolios', 'search', 'query']);
        });
    });

    describe('treaties', () => {
        it('generates correct keys', () => {
            expect(queryKeys.treaties.all).toEqual(['treaties']);
            expect(queryKeys.treaties.databases()).toEqual(['treaties', 'databases']);
            expect(queryKeys.treaties.byDatabase('1')).toEqual(['treaties', 'byDatabase', '1']);
            expect(queryKeys.treaties.search('query')).toEqual(['treaties', 'search', 'query']);
        });
    });

    describe('stepper', () => {
        it('generates correct keys', () => {
            expect(queryKeys.stepper.all).toEqual(['stepper']);
            expect(queryKeys.stepper.formData()).toEqual(['stepper', 'formData']);
            expect(queryKeys.stepper.step(1)).toEqual(['stepper', 'step', 1]);
        });
    });

    describe('demandSurge', () => {
        it('generates correct keys', () => {
            expect(queryKeys.demandSurge.all).toEqual(['demandSurge']);
            expect(queryKeys.demandSurge.items()).toEqual(['demandSurge', 'items']);
            expect(queryKeys.demandSurge.search('db', 'port')).toEqual(['demandSurge', 'search', 'db', 'port']);
        });
    });
});
