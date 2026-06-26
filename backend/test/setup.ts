// Global test setup. Runs once before all tests.
// Use this file for global mocks, environment variables, or cleanup.

export async function setup() {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/geradoc_test';
    process.env.JWT_SECRET = 'test_secret_key_for_vitest';
    process.env.NODE_ENV = 'test';
}

export async function teardown() {
    // Global cleanup after all tests
}
