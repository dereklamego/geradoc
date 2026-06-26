import React, { useState } from 'react';
import { useUser, useAuthActions } from '@/store/useAppStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { compressToBase64 } from '@/lib/image';
import { SubscriptionStatusCard } from '@/components/subscription/SubscriptionStatusCard';

const Profile = () => {
    const user = useUser();
    const { updateProfile } = useAuthActions();

    console.log('[Profile render] user.logoUrl present:', !!user?.logoUrl, 'length:', user?.logoUrl?.length);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        company_name: user?.company_name || '',
        document: user?.document || '',
        phone: user?.phone || '',
        address: user?.address || '',
        brandColor: user?.brandColor || '#2563eb',
    });
    const [logoPreview, setLogoPreview] = useState<string | null>(user?.logoUrl || null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLogoLoading, setIsLogoLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log('[Profile.handleLogoChange] file selected:', file.name, file.size);
        setIsLogoLoading(true);
        try {
            const base64 = await compressToBase64(file);
            console.log('[Profile.handleLogoChange] compressed base64 length:', base64.length);
            setLogoPreview(base64);

            const response = await api.profile.updateLogo(base64);
            console.log('[Profile.handleLogoChange] backend response:', response);
            updateProfile({ logoUrl: response.logoUrl });
            toast.success('Logo atualizada com sucesso!');
        } catch (err: any) {
            console.error('[Profile.handleLogoChange] error:', err);
            toast.error(err?.message || 'Erro ao enviar logo.');
        } finally {
            setIsLogoLoading(false);
            e.target.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('[Profile.handleSubmit] CALLED, formData:', formData);
        setIsLoading(true);
        try {
            console.log('[Profile.handleSubmit] calling api.profile.update');
            const result = await api.profile.update({
                name: formData.name,
                document: formData.document,
                phone: formData.phone,
                address: formData.address,
                brandColor: formData.brandColor,
            });
            console.log('[Profile.handleSubmit] backend result:', result);
            updateProfile({
                name: formData.name,
                company_name: formData.company_name,
                document: formData.document,
                phone: formData.phone,
                address: formData.address,
                brandColor: formData.brandColor,
            });
            toast.success('Perfil atualizado com sucesso!');
        } catch (err) {
            console.error('[Profile.handleSubmit] ERROR:', err);
            toast.error('Erro ao atualizar perfil.');
        } finally {
            setIsLoading(false);
        }
    };

    const isPaid = user?.plan && user.plan !== 'free';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Meu Perfil</h2>
                <p className="text-muted-foreground mt-1">Gerencie os dados que aparecerão em seus documentos.</p>
            </div>

            <SubscriptionStatusCard />


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
                                    <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="brandColor" className="font-bold">Cor da Marca</Label>
                                            <div
                                                className="w-8 h-8 rounded-full border shadow-sm"
                                                style={{ backgroundColor: formData.brandColor }}
                                            />
                                        </div>
                                        <div className="flex gap-3 items-center">
                                            <Input
                                                id="brandColor"
                                                type="color"
                                                className="w-16 h-10 p-1 cursor-pointer"
                                                value={formData.brandColor}
                                                onChange={handleChange}
                                            />
                                            <Input
                                                id="brandColorHex"
                                                type="text"
                                                className="flex-1 font-mono uppercase"
                                                value={formData.brandColor}
                                                onChange={(e) => setFormData(prev => ({ ...prev, brandColor: e.target.value }))}
                                            />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground italic">
                                            Esta cor será usada nos títulos e destaques dos seus PDFs.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50/50 border-t mt-6 py-4">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="min-w-[150px]"
                                    onClick={() => console.log('[Profile] Salvar Alterações button clicked')}
                                >
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
                                    {isLogoLoading ? (
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                                    ) : logoPreview ? (
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
                                    disabled={isLogoLoading}
                                />
                                <Label
                                    htmlFor={isPaid ? "logo" : ""}
                                    className={cn(
                                        "absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold rounded-xl",
                                        isPaid ? "bg-black/40" : "bg-slate-900/60 cursor-not-allowed"
                                    )}
                                    onClick={() => !isPaid && toast.info('Assine o Plano Pro para enviar sua logo!')}
                                >
                                    {isPaid ? 'Alterar Foto' : '🔒 Bloqueado'}
                                </Label>
                            </div>
                            <div className="text-center">
                                <p className="text-[11px] text-muted-foreground mb-4">
                                    Comprimida automaticamente para até 500×500px, max 300 KB.
                                </p>
                                {!isPaid && (
                                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                                        <p className="text-[10px] text-amber-600 font-medium">✨ Logos personalizadas estão disponíveis apenas para assinantes Pro.</p>
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
