import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminLayout from "./components/layout/AdminLayout";
import { useAuthActions } from "./store/useAppStore";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Generator from "./pages/Generator";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import Documents from "./pages/Documents";
import Subscription from "./pages/Subscription";
import Payment from "./pages/Payment";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import GeradorFeature from "./pages/features/GeradorFeature";
import ModelosFeature from "./pages/features/ModelosFeature";
import RelatoriosFeature from "./pages/features/RelatoriosFeature";
import SolucoesFeature from "./pages/features/SolucoesFeature";
import SuporteFeature from "./pages/features/SuporteFeature";
import AutomacaoFeature from "./pages/features/AutomacaoFeature";
import AjudaFeature from "./pages/features/AjudaFeature";
import TutoriaisFeature from "./pages/features/TutoriaisFeature";
import SobreFeature from "./pages/features/SobreFeature";
import ContatoFeature from "./pages/features/ContatoFeature";
import TermosFeature from "./pages/features/TermosFeature";
import PrivacidadeFeature from "./pages/features/PrivacidadeFeature";
import CookiesFeature from "./pages/features/CookiesFeature";
import LgpdFeature from "./pages/features/LgpdFeature";

const queryClient = new QueryClient();

const App = () => {
  const { fetchMe } = useAuthActions();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recursos/gerador" element={<GeradorFeature />} />
          <Route path="/recursos/modelos" element={<ModelosFeature />} />
          <Route path="/recursos/relatorios" element={<RelatoriosFeature />} />
          <Route path="/solucoes" element={<SolucoesFeature />} />
          <Route path="/suporte" element={<SuporteFeature />} />
          <Route path="/automacao" element={<AutomacaoFeature />} />
          <Route path="/ajuda" element={<AjudaFeature />} />
          <Route path="/tutoriais" element={<TutoriaisFeature />} />
          <Route path="/sobre" element={<SobreFeature />} />
          <Route path="/contato" element={<ContatoFeature />} />
          <Route path="/termos" element={<TermosFeature />} />
          <Route path="/privacidade" element={<PrivacidadeFeature />} />
          <Route path="/cookies" element={<CookiesFeature />} />
          <Route path="/lgpd" element={<LgpdFeature />} />

          {/* User Dashboard Routes - SaaS App */}
          <Route
            path="/app"
            element={
              <ProtectedRoute requiredRole="user">
                <DashboardLayout>
                  <Outlet />
                </DashboardLayout>
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="gerador" element={<Generator />} />
            <Route path="clientes" element={<Clients />} />
            <Route path="clientes/:id" element={<ClientDetails />} />
            <Route path="servicos" element={<Services />} />
            <Route path="documentos" element={<Documents />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="assinatura" element={<Subscription />} />
            <Route path="pagamento" element={<Payment />} />
          </Route>

          {/* Admin Routes - Isolated */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <Outlet />
                </AdminLayout>
              </ProtectedRoute>
            }
          >
            <Route index element={<Admin tab="overview" />} />
            <Route path="users" element={<Admin tab="users" />} />
            <Route path="finance" element={<Admin tab="finance" />} />
            <Route path="events" element={<Admin tab="events" />} />
            <Route path="logs" element={<Admin tab="logs" />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
