import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
    moduleNameMapper: {
        '.*/config/apiConfig$': '<rootDir>/src/test/__mocks__/apiConfigMock.ts',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@/assets/logo-aspen.png$': '<rootDir>/src/test/__mocks__/logoAspenMock.ts',
        '^@/assets/logo-sompo.png$': '<rootDir>/src/test/__mocks__/logoSompoMock.ts',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/test/__mocks__/fileMock.ts',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.app.json',
                isolatedModules: true,
            },
        ],
    },
    coverageThreshold: {
        global: {
            branches: 75,
            functions: 85,
            lines: 85,
            statements: 85,
        },
    },
    coverageReporters: ['text', 'text-summary'],
};

export default config;
