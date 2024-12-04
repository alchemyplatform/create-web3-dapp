declare module 'fs' {
    export * from 'node:fs';
}

declare module 'path' {
    export * from 'node:path';
}

declare module 'child_process' {
    export * from 'node:child_process';
}

// Add console and process to global scope
declare global {
    const console: Console;
    const process: NodeJS.Process;
} 