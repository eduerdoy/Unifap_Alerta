import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  CheckCircle, 
  Shield, 
  Zap, 
  Wrench,
  Clock,
  MapPin,
  User,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Trash2,
  Award,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { useAlerts } from "./AlertContext";

interface User {
  email: string;
  name: string;
}

interface AdminResolvedAlertsViewProps {
  user: User | null;
  onBack: () => void;
}

export function AdminResolvedAlertsView({ user, onBack }: AdminResolvedAlertsViewProps) {
  const { getResolvedAlerts, deleteAlert } = useAlerts();
  const resolvedAlerts = getResolvedAlerts();

  const getTypeIcon = (category: string) => {
    switch (category) {
      case "electrical":
        return <Zap className="w-5 h-5 text-yellow-600" />;
      case "security":
        return <Shield className="w-5 h-5 text-green-600" />;
      case "infrastructure":
        return <AlertTriangle className="w-5 h-5 text-green-600" />;
      case "maintenance":
        return <Wrench className="w-5 h-5 text-green-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getTypeLabel = (category: string) => {
    switch (category) {
      case "electrical":
        return "Elétrico";
      case "security":
        return "Segurança";
      case "infrastructure":
        return "Infraestrutura";
      case "maintenance":
        return "Manutenção";
      case "emergency":
        return "Emergência";
      default:
        return category;
    }
  };

  const getOriginalUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return <Badge className="bg-green-100 text-green-700 border-green-300">Era Crítica</Badge>;
      case "high":
        return <Badge className="bg-green-100 text-green-700 border-green-300">Era Alta</Badge>;
      case "medium":
        return <Badge className="bg-green-100 text-green-700 border-green-300">Era Média</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-700 border-green-300">Era Baixa</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-700 border-green-300">{urgency}</Badge>;
    }
  };

  const handleDeleteAlert = (alertId: number, alertTitle: string) => {
    if (window.confirm(`🗑️ EXCLUIR DO HISTÓRICO\n\nTem certeza que deseja remover permanentemente o alerta resolvido "${alertTitle}" do histórico?\n\n• Esta ação não pode ser desfeita\n• O registro será perdido permanentemente\n• Não afetará dados estatísticos já registrados\n\nDeseja continuar?`)) {
      deleteAlert(alertId);
    }
  };

  // Estatísticas
  const adminResolvedAlerts = resolvedAlerts.filter(alert => 
    alert.resolvedBy?.includes('Admin') || alert.resolvedBy?.includes('Administrador')
  );
  
  const criticalResolved = resolvedAlerts.filter(alert => alert.urgency === 'critical');
  const highResolved = resolvedAlerts.filter(alert => alert.urgency === 'high');

  // Agrupar por categoria para estatísticas
  const categoryStats = resolvedAlerts.reduce((acc, alert) => {
    acc[alert.category] = (acc[alert.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={onBack}
              className="p-2 text-gray-500 hover:text-gray-700 active:scale-95 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg text-gray-900">Alertas Resolvidos</h1>
              <p className="text-sm text-gray-600">
                {resolvedAlerts.length} problema{resolvedAlerts.length !== 1 ? 's' : ''} já 
                {resolvedAlerts.length !== 1 ? ' foram' : ' foi'} solucionado{resolvedAlerts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        
        {/* Performance Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xl text-green-900 mb-1">{adminResolvedAlerts.length}</p>
              <p className="text-xs text-green-700">Resolvidos por Admin</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xl text-blue-900 mb-1">{criticalResolved.length + highResolved.length}</p>
              <p className="text-xs text-blue-700">Alta Prioridade Resolvidos</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Performance */}
        {Object.keys(categoryStats).length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <h3 className="text-gray-900">Performance por Categoria</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(categoryStats).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{getTypeLabel(category)}:</span>
                    <Badge variant="outline" className="text-gray-700">
                      {count} resolvido{count !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {resolvedAlerts.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <h3 className="text-green-900 mb-1">Excelente Trabalho! 🎉</h3>
                <p className="text-sm text-green-700">
                  {resolvedAlerts.length} problema{resolvedAlerts.length !== 1 ? 's foram resolvidos' : ' foi resolvido'} com sucesso.
                  {adminResolvedAlerts.length > 0 && (
                    <span> {adminResolvedAlerts.length} deles pela administração.</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Resolved Alerts List */}
        {resolvedAlerts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-600 mb-2">Nenhum Alerta Resolvido</h3>
              <p className="text-sm text-gray-500">
                Quando os problemas forem solucionados, o histórico aparecerá aqui.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-900">Histórico Completo ({resolvedAlerts.length})</h2>
            </div>
            
            {resolvedAlerts.map((alert) => {
              const isAdminResolved = alert.resolvedBy?.includes('Admin') || alert.resolvedBy?.includes('Administrador');
              
              return (
                <Card key={alert.id} className={`border-l-4 ${isAdminResolved ? 'border-l-blue-500 bg-blue-50/30' : 'border-l-green-500 bg-green-50/30'}`}>
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(alert.category)}
                        <div>
                          <h3 className="text-gray-900 mb-1">{alert.title}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-500 text-white text-xs">
                              ✅ Resolvido
                            </Badge>
                            {getOriginalUrgencyBadge(alert.urgency)}
                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                              {getTypeLabel(alert.category)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteAlert(alert.id, alert.title)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {alert.description}
                    </p>

                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      {alert.location}
                    </div>

                    {/* Resolution Info */}
                    <div className={`border rounded-lg p-3 mb-3 ${
                      isAdminResolved
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-green-50 border-green-200'
                    }`}>
                      <div className={`flex items-center text-sm mb-1 ${
                        isAdminResolved ? 'text-blue-800' : 'text-green-800'
                      }`}>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="font-medium">
                          {isAdminResolved ? '🔧 Resolvido pela Administração' : 'Problema Solucionado'}
                        </span>
                      </div>
                      {alert.resolvedBy && (
                        <div className={`flex items-center text-xs ${
                          isAdminResolved ? 'text-blue-700' : 'text-green-700'
                        }`}>
                          <User className="w-3 h-3 mr-1" />
                          Resolvido por: {alert.resolvedBy}
                        </div>
                      )}
                      {alert.resolvedAt && (
                        <div className={`flex items-center text-xs mt-1 ${
                          isAdminResolved ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          <Calendar className="w-3 h-3 mr-1" />
                          {alert.resolvedAt}
                        </div>
                      )}
                      {isAdminResolved && (
                        <div className="text-xs text-blue-600 mt-2 italic">
                          ⚡ Resolução oficial registrada no sistema
                        </div>
                      )}
                    </div>

                    {/* Original Report Time */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Reportado: {alert.createdAt}
                      </div>
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        Por: {alert.createdBy}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center text-xs text-gray-500 mt-6 p-4">
          <p>Histórico administrativo de problemas solucionados</p>
          <p>Sistema de gestão UNIFAP Alerta 📊</p>
        </div>
      </div>
    </div>
  );
}