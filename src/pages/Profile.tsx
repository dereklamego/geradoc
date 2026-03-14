import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        company_name: user?.company_name || '',
        document: user?.document || '',
        phone: user?.phone || '',
        address: '',
    });
    const [logoPreview, setLogoPreview] = useState<string | null>(user?.logoUrl || null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB limit
                toast.error('A imagem deve ter no máximo 1MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Mock update logic
            await new Promise((resolve) => setTimeout(resolve, 800));
            updateProfile({
                ...formData,
                logoUrl: logoPreview || undefined
            });
            toast.success('Perfil atualizado com sucesso!');
        } catch (error) {
            toast.error('Erro ao atualizar perfil.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Meu Perfil</h2>
                    <p className="text-muted-foreground mt-1">Gerencie os dados que aparecerão em seus documentos.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-full border shadow-sm">
                    <span className="text-sm font-medium text-slate-500">Plano Atual:</span>
                    <Badge variant={user?.plan === 'premium' ? 'default' : 'secondary'} className="capitalize px-3">
                        {user?.plan === 'premium' ? 'Premium' : 'Gratuito'}
                    </Badge>
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs font-bold" onClick={() => navigate('/app/assinatura')}>
                        Mudar de Plano
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b">
                            <CardTitle className="text-lg">Dados da Empresa</CardTitle>
                            <CardDescription>
                                Estas informações serão exibidas no cabeçalho dos seus documentos gerados.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-6 pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        <Label htmlFor="phone">Telefone de Contato</Label>
                                        <Input
                                            id="phone"
                                            placeholder="(11) 99999-9999"
                                            value={formData.phone}
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
                            <CardFooter className="bg-slate-50/50 border-t mt-6 py-4">
                                <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                                    {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Logotipo</CardTitle>
                            <CardDescription>Sua marca no PDF.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-6">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 relative">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-xs text-muted-foreground text-center px-2">Nenhuma logo selecionada</span>
                                    )}
                                </div>
                                <Input
                                    id="logo"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleLogoChange}
                                />
                                <Label
                                    htmlFor={user?.plan === 'premium' ? "logo" : ""}
                                    className={cn(
                                        "absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold rounded-xl",
                                        user?.plan === 'premium' ? "bg-black/40" : "bg-slate-900/60 cursor-not-allowed"
                                    )}
                                    onClick={() => user?.plan !== 'premium' && toast.info('Assine o Plano Pro para enviar sua logo!')}
                                >
                                    {user?.plan === 'premium' ? 'Alterar Foto' : '🔒 Bloqueado'}
                                </Label>
                            </div>
                            <div className="text-center">
                                <p className="text-[11px] text-muted-foreground mb-4">
                                    Recomendado: Quadra (500x500px). Máx 1MB.
                                </p>
                                {user?.plan === 'free' && (
                                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                                        <p className="text-[10px] text-amber-600 font-medium">✨ Logos personalizadas estão disponíveis apenas para assinantes Premium.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
