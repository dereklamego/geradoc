import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthActions, useIsAuthLoading } from '@/store/useAppStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuthActions();
    const isLoading = useIsAuthLoading();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/app';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Bem-vindo ao GeraDoc!');
            navigate(from, { replace: true });
        } catch (error: any) {
            toast.error(error.message || 'Credenciais inválidas. Tente novamente.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-primary/10">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-primary">GeraDoc</CardTitle>
                    <CardDescription className="text-center">
                        Entre com suas credenciais para acessar o sistema
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Senha</Label>
                                <Button variant="link" className="px-0 font-normal text-xs" type="button">
                                    Esqueceu a senha?
                                </Button>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground font-normal">
                            Não tem uma conta?{' '}
                            <Button
                                variant="link"
                                className="px-0 font-semibold"
                                type="button"
                                onClick={() => navigate('/register')}
                            >
                                Cadastre-se
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default Login;
