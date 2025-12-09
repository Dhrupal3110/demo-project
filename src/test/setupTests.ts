import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { webcrypto } from 'node:crypto';
import { BroadcastChannel } from 'worker_threads';

Object.assign(global, { TextEncoder, TextDecoder });
Object.defineProperty(global, 'crypto', {
    value: webcrypto,
    writable: true
});

// Mock BroadcastChannel
global.BroadcastChannel = BroadcastChannel as unknown as typeof global.BroadcastChannel;

// Mock global fetch if needed
if (!global.fetch) {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
            text: () => Promise.resolve(''),
            blob: () => Promise.resolve(new Blob()),
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
            headers: new Headers(),
            clone: function () { return this; }
        } as unknown as Response)
    );
}

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));
