import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Profile = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        company_name: user?.company_name || '',
        document: user?.document || '',
        phone: user?.phone || '',
        address: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Mock update logic
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Perfil atualizado com sucesso!');
        } catch (error) {
            toast.error('Erro ao atualizar perfil.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Dados da Empresa</CardTitle>
                    <CardDescription>
                        Estas informações serão exibidas no cabeçalho dos seus documentos gerados.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="company_name">Nome da Empresa / Fantasia</Label>
                                <Input
                                    id="company_name"
                                    placeholder="Ex: Ar Condicionado Silva"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="document">CPF ou CNPJ</Label>
                                <Input
                                    id="document"
                                    placeholder="00.000.000/0001-00"
                                    value={formData.document}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome do Responsável</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefone de Contato</Label>
                                <Input
                                    id="phone"
                                    placeholder="(11) 99999-9999"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="email">E-mail Comercial</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="address">Endereço Completo</Label>
                                <Input
                                    id="address"
                                    placeholder="Rua Exemplo, 123 - Bairro, Cidade - UF"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default Profile;
