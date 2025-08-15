import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  Shield, 
  LogOut, 
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  Trash2,
  ArrowRight,
  BarChart3,
  Settings,
  MessageSquare,
  Send
} from "lucide-react";
import { CreateAlertModal } from "./CreateAlertModal";
import { AdminActiveAlertsView } from "./AdminActiveAlertsView";
import { AdminResolvedAlertsView } from "./AdminResolvedAlertsView";
import { AdminTicketsView } from "./AdminTicketsView";
import { useAlerts } from "./AlertContext";
import { useTickets } from "./TicketContext";

interface User {
  email: string;
  name: string;
}

interface AdminDashboardProps {
  user: User | null;
  onLogout: () => void;
}

type AdminView = 'dashboard' | 'activeAlerts' | 'resolvedAlerts' | 'tickets';

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const { getActiveAlerts, getResolvedAlerts, resolveAlert, deleteAlert } = useAlerts();
  const { getPendingTickets } = useTickets();
  
  const activeAlerts = getActiveAlerts();
  const resolvedAlerts = getResolvedAlerts();
  const pendingTickets = getPendingTickets();

  const criticalAlerts = activeAlerts.filter(alert => alert.urgency === 'critical');
  const highUrgencyAlerts = activeAlerts.filter(alert => alert.urgency === 'high');

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="w-4 h-4" />;
      case 'electrical': return <AlertTriangle className="w-4 h-4" />;
      case 'maintenance': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleResolveAlert = (alertId: number) => {
    resolveAlert(alertId, user?.name || 'Administrador');
  };

  const handleDeleteAlert = (alertId: number, alertTitle: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o alerta "${alertTitle}"?\n\nEsta ação não pode ser desfeita.`)) {
      deleteAlert(alertId);
    }
  };

  // Renderizar views diferentes baseado no estado
  if (currentView === 'activeAlerts') {
    return (
      <>
        <AdminActiveAlertsView 
          user={user}
          onBack={() => setCurrentView('dashboard')}
          onCreateAlert={() => setShowCreateAlert(true)}
        />
        <CreateAlertModal 
          isOpen={showCreateAlert}
          onClose={() => setShowCreateAlert(false)}
        />
      </>
    );
  }

  if (currentView === 'resolvedAlerts') {
    return (
      <AdminResolvedAlertsView 
        user={user}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'tickets') {
    return (
      <AdminTicketsView 
        user={user}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-full">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg text-gray-900">Admin - UNIFAP Alerta</h1>
              <p className="text-sm text-gray-600">Painel Administrativo - {user?.name}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-gray-500 hover:text-gray-700 active:scale-95 transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        
        {/* Pending Tickets Notification */}
        {pendingTickets.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="bg-blue-600 p-3 rounded-full animate-pulse">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                  {pendingTickets.length}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-blue-900 mb-1">
                  🚨 {pendingTickets.length} Novo{pendingTickets.length > 1 ? 's' : ''} Chamado{pendingTickets.length > 1 ? 's' : ''} Recebido{pendingTickets.length > 1 ? 's' : ''}!
                </h3>
                <p className="text-sm text-blue-700">
                  {pendingTickets.length > 1 ? 'Estudantes enviaram chamados' : 'Um estudante enviou um chamado'} que {pendingTickets.length > 1 ? 'precisam' : 'precisa'} de análise urgente
                </p>
                <div className="flex items-center mt-2 text-xs text-blue-600">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Responda em até 4 horas</span>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('tickets')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-md"
              >
                📋 Analisar Agora
              </button>
            </div>
          </div>
        )}
        {/* Main Actions */}
        <div>
          <h2 className="mb-4 text-gray-900">🚨 Painel Principal</h2>
          <div className="space-y-4">
            <Button
              onClick={() => setShowCreateAlert(true)}
              className="w-full h-16 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg active:scale-95 transition-all"
            >
              <Plus className="w-6 h-6 mr-3" />
              Lançar Alerta para Todos
            </Button>
            
            <Button
              onClick={() => setCurrentView('tickets')}
              variant="outline"
              className={`w-full h-16 border-blue-300 text-blue-600 hover:bg-blue-50 active:scale-95 transition-all ${
                pendingTickets.length > 0 ? 'ring-2 ring-blue-300 bg-blue-50' : ''
              }`}
            >
              <MessageSquare className="w-6 h-6 mr-3" />
              <div className="flex flex-col items-start flex-1">
                <span>📋 Chamados dos Alunos</span>
                <span className="text-sm text-blue-500">
                  {pendingTickets.length > 0 
                    ? `${pendingTickets.length} aguardando análise` 
                    : 'Nenhum chamado pendente'}
                </span>
              </div>
              {pendingTickets.length > 0 && (
                <div className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full animate-pulse">
                  {pendingTickets.length}
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <h2 className="mb-4 text-gray-900">📊 Visão Geral</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className="bg-red-50 border-red-200 cursor-pointer hover:bg-red-100 transition-colors active:scale-95"
              onClick={() => setCurrentView('activeAlerts')}
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-3">
                  <AlertTriangle className="w-10 h-10 text-red-600" />
                </div>
                <p className="text-3xl text-red-900 mb-2">{activeAlerts.length}</p>
                <p className="text-sm text-red-700">Alertas Ativos</p>
                <p className="text-xs text-red-600 mt-1">Toque para gerenciar</p>
              </CardContent>
            </Card>
            
            <Card 
              className="bg-green-50 border-green-200 cursor-pointer hover:bg-green-100 transition-colors active:scale-95"
              onClick={() => setCurrentView('resolvedAlerts')}
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-3">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-3xl text-green-900 mb-2">{resolvedAlerts.length}</p>
                <p className="text-sm text-green-700">Resolvidos</p>
                <p className="text-xs text-green-600 mt-1">Ver histórico</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity Summary */}
        {activeAlerts.length > 0 && (
          <div>
            <h2 className="mb-4 text-gray-900">⚡ Últimos Alertas Ativos</h2>
            <div className="space-y-3">
              {activeAlerts.slice(0, 2).map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(alert.category)}
                        <div>
                          <h3 className="text-gray-900">{alert.title}</h3>
                          <Badge className={`text-xs ${getUrgencyColor(alert.urgency)} mt-1`}>
                            {alert.urgency.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {alert.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {alert.createdAt}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {activeAlerts.length > 2 && (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="p-4 text-center">
                    <Button
                      onClick={() => setCurrentView('activeAlerts')}
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Ver todos os {activeAlerts.length} alertas ativos
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Alert Modal */}
      <CreateAlertModal 
        isOpen={showCreateAlert}
        onClose={() => setShowCreateAlert(false)}
      />
    </div>
  );
}