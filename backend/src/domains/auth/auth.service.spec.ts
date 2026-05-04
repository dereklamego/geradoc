import { describe, it, expect, vi, beforeEach, type MockedObject } from 'vitest';
import { AuthService } from './auth.service.ts';
import { AuthRepository } from './auth.repository.ts';
import argon2 from 'argon2';

// --- MOCK ---
// Isolate the repository: vi.mock replaces the entire module with an auto-mock.
// No real database calls are made.
vi.mock('./auth.repository.js');
vi.mock('argon2');

const mockUser = {
    id: 'user-uuid-123',
    email: 'test@geradoc.com',
    name: 'Test User',
    passwordHash: 'hashed_secret',
    role: 'USER' as const,
    plan: 'FREE' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    subscription: null,
};

describe('AuthService', () => {
    let authService: AuthService;
    let authRepository: AuthRepository;

    beforeEach(() => {
        vi.clearAllMocks();
        // Inject the mocked repository via constructor (Dependency Injection)
        authRepository = new AuthRepository() as MockedObject<AuthRepository>;
        authService = new AuthService(authRepository);
    });

    // ============================================================
    // login()
    // ============================================================
    describe('login', () => {
        it('should return user on successful login', async () => {
            // Arrange
            vi.mocked(authRepository.findByEmail).mockResolvedValue(mockUser);
            vi.mocked(argon2.verify).mockResolvedValue(true);

            // Act
            const result = await authService.login({
                email: 'test@geradoc.com',
                password: 'correct_password',
            });

            // Assert
            expect(result).toMatchObject({ id: mockUser.id, email: mockUser.email });
            expect(authRepository.findByEmail).toHaveBeenCalledWith('test@geradoc.com');
            expect(argon2.verify).toHaveBeenCalledWith(mockUser.passwordHash, 'correct_password');
        });

        it('should throw "Invalid credentials" if user is not found', async () => {
            // Arrange
            vi.mocked(authRepository.findByEmail).mockResolvedValue(null);

            // Act & Assert
            await expect(
                authService.login({ email: 'ghost@geradoc.com', password: 'any' })
            ).rejects.toThrow('Invalid credentials');

            expect(argon2.verify).not.toHaveBeenCalled();
        });

        it('should throw "Invalid credentials" if password is wrong', async () => {
            // Arrange
            vi.mocked(authRepository.findByEmail).mockResolvedValue(mockUser);
            vi.mocked(argon2.verify).mockResolvedValue(false);

            // Act & Assert
            await expect(
                authService.login({ email: 'test@geradoc.com', password: 'wrong_password' })
            ).rejects.toThrow('Invalid credentials');
        });
    });

    // ============================================================
    // register()
    // ============================================================
    describe('register', () => {
        it('should create and return a new user', async () => {
            // Arrange
            vi.mocked(authRepository.findByEmail).mockResolvedValue(null);
            vi.mocked(argon2.hash).mockResolvedValue('new_hashed_password' as never);
            vi.mocked(authRepository.create).mockResolvedValue(mockUser);

            // Act
            const result = await authService.register({
                email: 'new@geradoc.com',
                password: 'password123',
                name: 'New User',
            });

            // Assert
            expect(result).toEqual(mockUser);
            expect(authRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({ email: 'new@geradoc.com' })
            );
        });

        it('should throw "User already exists" if email is taken', async () => {
            // Arrange
            vi.mocked(authRepository.findByEmail).mockResolvedValue(mockUser);

            // Act & Assert
            await expect(
                authService.register({ email: 'test@geradoc.com', password: 'pass', name: 'Dup' })
            ).rejects.toThrow('User already exists');

            expect(authRepository.create).not.toHaveBeenCalled();
        });
    });
});
