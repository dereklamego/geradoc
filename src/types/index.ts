// Usuário Autenticado e Perfil
export interface IUser {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'beta' | 'admin';
    plan: 'free' | 'premium';
    company_name?: string;
    document?: string; // CPF/CNPJ do prestador
    phone?: string;
    address?: string;
    logoUrl?: string; // URL da logo personalizada
    brandColor?: string; // Cor principal da marca (HEX)
    monthlyUsage: number;
}

// Catálogo de Clientes
export interface IClient {
    id: string;
    name: string;
    type: 'PF' | 'PJ';
    document: string; // CPF ou CNPJ
    phone: string;
    address: string;
    email?: string;
}

// Itens de Serviço/Produto
export interface IServiceItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface IService {
    id: string;
    name: string;
    default_price: number;
    default_warranty_months: number;
}

// Documento Gerado
export interface IDocument {
    id: string;
    type: 'Orçamento' | 'OS' | 'Recibo';
    clientId: string;
    clientName: string;
    value: number;
    date: string; // ISO format
    items: IServiceItem[];
    status: 'Pendente' | 'Aprovado' | 'Finalizado';
    clientDataSnapshot: IClient; // Cópia dos dados no momento da geração
}
