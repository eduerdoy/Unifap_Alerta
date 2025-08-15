import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  Bell, 
  LogOut, 
  AlertTriangle,
  Shield,
  Clock,
  MapPin,
  CheckCircle,
  Send,
  MessageSquare
} from "lucide-react";
import { ReportModal } from "./ReportModal";
import { ActiveAlertsView } from "./ActiveAlertsView";
import { ResolvedAlertsView } from "./ResolvedAlertsView";
import { useAlerts } from "./AlertContext";
import { useTickets } from "./TicketContext";

interface User {
  email: string;
  name: string;
}

interface StudentDashboardProps {
  user: User | null;
  onLogout: () => void;
}

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showActiveAlerts, setShowActiveAlerts] = useState(false);
  const [showResolvedAlerts, setShowResolvedAlerts] = useState(false);
  
  const { getActiveAlerts, getResolvedAlerts } = useAlerts();
  const { getPendingTickets } = useTickets();
  const activeAlerts = getActiveAlerts();
  const resolvedAlerts = getResolvedAlerts();
  const pendingTickets = getPendingTickets().filter(ticket => ticket.createdBy === user?.name);

  // Usar os alertas do contexto
  const recentAlerts = [...activeAlerts, ...resolvedAlerts.slice(0, 2)];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Ativo</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Resolvido</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeIcon = (category: string) => {
    switch (category) {
      case "electrical":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "maintenance":
        return <Shield className="w-4 h-4 text-blue-500" />;
      case "security":
        return <Bell className="w-4 h-4 text-orange-500" />;
      case "infrastructure":
        return <AlertTriangle className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-full">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg text-gray-900">UNIFAP Alerta</h1>
              <p className="text-sm text-gray-600">Olá, {user?.name}</p>
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
      <div className="flex-1 overflow-auto pb-6">
        {showActiveAlerts ? (
          <ActiveAlertsView onBack={() => setShowActiveAlerts(false)} />
        ) : showResolvedAlerts ? (
          <div>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 mb-4">
              <button
                onClick={() => setShowResolvedAlerts(false)}
                className="flex items-center text-blue-600 hover:text-blue-700 active:scale-95 transition-all"
              >
                <MapPin className="w-4 h-4 mr-2 rotate-180" />
                Voltar
              </button>
            </div>
            <ResolvedAlertsView />
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {/* Alert Notification */}
            {activeAlerts.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-600 p-2 rounded-full animate-pulse">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-red-900 mb-1">
                      {activeAlerts.length} Alerta{activeAlerts.length > 1 ? 's' : ''} Ativo{activeAlerts.length > 1 ? 's' : ''}
                    </h3>
                    <p className="text-sm text-red-700">
                      Toque em "Alertas Ativos" para ver os detalhes
                    </p>
                  </div>
                  <button
                    onClick={() => setShowActiveAlerts(true)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 active:scale-95 transition-all"
                  >
                    Ver
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div>
              <h2 className="mb-4 text-gray-900">📋 Enviar Chamado</h2>
              <div className="space-y-3">
                <Button
                  onClick={() => setShowReportModal(true)}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg active:scale-95 transition-all"
                >
                  <Send className="w-6 h-6 mr-3" />
                  <div className="flex flex-col items-start">
                    <span>📋 Enviar Chamado para Administração</span>
                    <span className="text-sm opacity-90">Reporte problemas no campus</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Pending Tickets Notification */}
            {pendingTickets.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 p-2 rounded-full">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-blue-900 mb-1">
                      📋 {pendingTickets.length} Chamado{pendingTickets.length > 1 ? 's' : ''} Enviado{pendingTickets.length > 1 ? 's' : ''}
                    </h3>
                    <p className="text-sm text-blue-700">
                      {pendingTickets.length > 1 ? 'Seus chamados estão' : 'Seu chamado está'} sendo analisado{pendingTickets.length > 1 ? 's' : ''} pela administração
                    </p>
                  </div>
                  <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full animate-pulse">
                    Em análise
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className="bg-blue-50 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors active:scale-95"
                onClick={() => setShowActiveAlerts(true)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <AlertTriangle className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-2xl text-blue-900 mb-1">{activeAlerts.length}</p>
                  <p className="text-sm text-blue-700">Alertas Ativos</p>
                </CardContent>
              </Card>
              
              <Card 
                className="bg-green-50 border-green-200 cursor-pointer hover:bg-green-100 transition-colors active:scale-95"
                onClick={() => setShowResolvedAlerts(true)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-2xl text-green-900 mb-1">{resolvedAlerts.length}</p>
                  <p className="text-sm text-green-700">Resolvidos</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Alerts */}
            <div>
              <h2 className="mb-4 text-gray-900">Alertas Recentes</h2>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <Card key={alert.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(alert.category)}
                          <h3 className="text-gray-900">{alert.title}</h3>
                        </div>
                        {getStatusBadge(alert.status)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {alert.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {alert.timeAgo}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Report Modal */}
      <ReportModal 
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        user={user}
      />


    </div>
  );
}