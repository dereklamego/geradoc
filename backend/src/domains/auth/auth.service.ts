import argon2 from 'argon2';
import { AuthRepository } from './auth.repository.ts';
import { RegisterInput, LoginInput } from './auth.schema.ts';

export class AuthService {
    constructor(private authRepository: AuthRepository) { }

    async register(data: RegisterInput) {
        const { email, password, name } = data;

        const existingUser = await this.authRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const passwordHash = await argon2.hash(password);

        return this.authRepository.create({
            email,
            passwordHash,
            name,
        });
    }

    async login(data: LoginInput) {
        const { email, password } = data;

        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            const error = new Error('Invalid credentials');
            (error as any).statusCode = 401;
            throw error;
        }

        const isPasswordValid = await argon2.verify(user.passwordHash, password);
        if (!isPasswordValid) {
            const error = new Error('Invalid credentials');
            (error as any).statusCode = 401;
            throw error;
        }

        return user;
    }

    async getUserById(id: string) {
        const user = await this.authRepository.findById(id);
        if (!user) {
            const error = new Error('User not found');
            (error as any).statusCode = 404;
            throw error;
        }
        return user;
    }
}
