import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        // Test files must match this pattern to be picked up
        include: ['src/**/*.spec.ts', 'test/**/*.spec.ts', 'test/**/*.e2e-spec.ts'],
        // Global setup before all tests
        globalSetup: './test/setup.ts',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/domains/**', 'src/shared/**'],
            exclude: ['**/*.spec.ts', '**/*.d.ts'],
        },
    },
});
