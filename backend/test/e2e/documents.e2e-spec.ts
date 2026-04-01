import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { buildApp } from '../../src/app.js';
import type { FastifyInstance } from 'fastify';

// --- MOCK ---
// In E2E tests we isolate the database layer. The 'prisma' client
// is mocked so no real PostgreSQL connection is needed.
vi.mock('../../src/shared/db/prisma.js', () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
        document: {
            findMany: vi.fn(),
            findFirst: vi.fn(),
            create: vi.fn(),
            count: vi.fn(),
            update: vi.fn(),
        },
    },
}));

import { prisma } from '../../src/shared/db/prisma.js';

// A valid JWT for user 'user-e2e-id' signed with the test secret 'test_secret_key_for_vitest'
// Generate via: jwt.sign({ id: 'user-e2e-id', email: 'e2e@test.com', role: 'USER' }, 'test_secret_key_for_vitest')
// This is a pre-generated static token for testing purposes.
const TEST_TOKEN = 'Bearer mock_token_for_e2e'; // Will be replaced by real sign below

let app: FastifyInstance;
let authToken: string;

describe('Documents E2E', () => {
    beforeAll(async () => {
        app = await buildApp();
        await app.ready();

        // Generate a real JWT using the app's built-in jwt plugin
        authToken = app.jwt.sign({ id: 'user-e2e-id', email: 'e2e@test.com', role: 'USER' });
    });

    afterAll(async () => {
        await app.close();
        vi.clearAllMocks();
    });

    // ============================================================
    // POST /api/documents
    // ============================================================
    describe('POST /api/documents', () => {
        it('should create a document for a PREMIUM user (no limit)', async () => {
            // Arrange
            vi.mocked(prisma.user.findUnique).mockResolvedValue({
                id: 'user-e2e-id',
                plan: 'PREMIUM',
            } as any);
            vi.mocked(prisma.document.create).mockResolvedValue({
                id: 'doc-new-id',
                title: 'Contrato de Prestação de Serviços',
                content: { text: 'content here' },
                userId: 'user-e2e-id',
                version: 1,
                status: 'DRAFT',
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                folderId: null,
                templateId: null,
            } as any);

            // Act
            const response = await app.inject({
                method: 'POST',
                url: '/api/documents',
                headers: { Authorization: `Bearer ${authToken}` },
                payload: {
                    title: 'Contrato de Prestação de Serviços',
                    content: { text: 'content here' },
                },
            });

            // Assert
            expect(response.statusCode).toBe(201);
            const body = JSON.parse(response.body);
            expect(body.title).toBe('Contrato de Prestação de Serviços');
            expect(body.version).toBe(1);
        });

        it('should return 403 when FREE user exceeds 5 document limit', async () => {
            // Arrange
            vi.mocked(prisma.user.findUnique).mockResolvedValue({
                id: 'user-e2e-id',
                plan: 'FREE',
            } as any);
            // Simulate 5 documents already existing
            vi.mocked(prisma.document.count).mockResolvedValue(5);

            // Act
            const response = await app.inject({
                method: 'POST',
                url: '/api/documents',
                headers: { Authorization: `Bearer ${authToken}` },
                payload: {
                    title: 'Sixth Document',
                    content: { text: 'this should fail' },
                },
            });

            // Assert
            expect(response.statusCode).toBe(403);
            const body = JSON.parse(response.body);
            expect(body.code).toBe('LIMIT_EXCEEDED');
        });

        it('should return 401 when no auth token is provided', async () => {
            // Arrange, Act
            const response = await app.inject({
                method: 'POST',
                url: '/api/documents',
                payload: { title: 'No Auth', content: {} },
            });

            // Assert
            expect(response.statusCode).toBe(401);
        });
    });

    // ============================================================
    // GET /api/documents
    // ============================================================
    describe('GET /api/documents', () => {
        it('should list user documents with pagination', async () => {
            // Arrange
            vi.mocked(prisma.document.findMany).mockResolvedValue([
                { id: 'doc-1', title: 'Doc 1', userId: 'user-e2e-id' } as any,
            ]);
            vi.mocked(prisma.document.count).mockResolvedValue(1);

            // Act
            const response = await app.inject({
                method: 'GET',
                url: '/api/documents?page=1&limit=10',
                headers: { Authorization: `Bearer ${authToken}` },
            });

            // Assert
            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.total).toBe(1);
            expect(body.items).toHaveLength(1);
        });
    });
});
