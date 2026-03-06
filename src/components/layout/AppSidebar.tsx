import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    FileText,
    Users,
    Settings,
    LayoutDashboard,
    LogOut,
    User,
    ShieldCheck,
    Package,
    Box, // Added Box icon
} from 'lucide-react';

const menuItems = [
    { title: "Dashboard", url: "/app", icon: LayoutDashboard },
    { title: "Gerador", url: "/app/gerador", icon: FileText },
    { title: "Documentos", url: "/app/documentos", icon: FileText },
    { title: "Clientes", url: "/app/clientes", icon: Users },
    { title: "Catálogo", url: "/app/servicos", icon: Box },
    { title: 'Perfil', url: '/app/perfil', icon: User },
];

const AppSidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader className="border-b px-4 py-4">
                <div className="flex items-center gap-2 font-bold text-primary transition-all group-data-[collapsible=icon]:hidden">
                    <FileText className="h-6 w-6" />
                    <span className="text-xl">GeraDoc</span>
                </div>
                <div className="flex items-center justify-center font-bold text-primary group-data-[collapsible=icon]:flex hidden">
                    <FileText className="h-6 w-6" />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        onClick={() => navigate(item.url)}
                                        isActive={location.pathname === item.url}
                                        tooltip={item.title}
                                    >
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}

                            {user?.role === 'admin' && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={() => navigate('/admin')}
                                        isActive={location.pathname === '/admin'}
                                        tooltip="Admin"
                                    >
                                        <ShieldCheck />
                                        <span>Admin</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={logout} tooltip="Sair">
                            <LogOut />
                            <span>Sair</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <div className="mt-4 flex items-center gap-3 px-2 group-data-[collapsible=icon]:hidden">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                        {user?.name?.[0] || 'U'}
                    </div>
                    <div className="flex flex-col overflow-hidden text-sm">
                        <span className="truncate font-medium">{user?.name}</span>
                        <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
};

export default AppSidebar;
