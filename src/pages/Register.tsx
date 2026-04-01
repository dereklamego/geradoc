import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthActions, useIsAuthLoading } from '@/store/useAppStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuthActions();
    const isLoading = useIsAuthLoading();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            toast.success('Conta criada com sucesso! Bem-vindo ao GeraDoc.');
            navigate('/app');
        } catch (error: any) {
            toast.error(error.message || 'Erro ao criar conta. Tente novamente.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-primary/10">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-primary">Crie sua conta</CardTitle>
                    <CardDescription className="text-center">
                        Comece a gerar seus documentos de forma profissional
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                                id="name"
                                placeholder="Seu nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="exemplo@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? 'Criando conta...' : 'Cadastrar'}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground font-normal">
                            Já tem uma conta?{' '}
                            <Button
                                variant="link"
                                className="px-0 font-semibold"
                                type="button"
                                onClick={() => navigate('/login')}
                            >
                                Entrar
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default Register;
