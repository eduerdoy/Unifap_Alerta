import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Shield, 
  Zap, 
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Calendar,
  Trash2,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  TrendingUp
} from "lucide-react";
import { useAlerts } from "./AlertContext";

interface User {
  email: string;
  name: string;
}

interface AdminActiveAlertsViewProps {
  user: User | null;
  onBack: () => void;
  onCreateAlert: () => void;
}

export function AdminActiveAlertsView({ user, onBack, onCreateAlert }: AdminActiveAlertsViewProps) {
  const { getActiveAlerts, resolveAlert, deleteAlert } = useAlerts();
  const activeAlerts = getActiveAlerts();

  const getTypeIcon = (category: string) => {
    switch (category) {
      case "electrical":
        return <Zap className="w-5 h-5 text-yellow-600" />;
      case "security":
        return <Shield className="w-5 h-5 text-red-600" />;
      case "infrastructure":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case "maintenance":
        return <Wrench className="w-5 h-5 text-blue-600" />;
      case "emergency":
        return <AlertTriangle className="w-5 h-5 text-red-700" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'text-red-800 bg-red-100 border-red-300';
      case 'high':
        return 'text-orange-800 bg-orange-100 border-orange-300';
      case 'medium':
        return 'text-blue-800 bg-blue-100 border-blue-300';
      case 'low':
        return 'text-gray-800 bg-gray-100 border-gray-300';
      default:
        return 'text-gray-800 bg-gray-100 border-gray-300';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const handleResolveAlert = (alertId: number, alertTitle: string) => {
    if (window.confirm(`Tem certeza que deseja marcar o alerta "${alertTitle}" como resolvido?\n\nEsta ação notificará todos os usuários.`)) {
      resolveAlert(alertId, user?.name || 'Administrador');
    }
  };

  const handleDeleteAlert = (alertId: number, alertTitle: string) => {
    if (window.confirm(`⚠️ ATENÇÃO: Exclusão Permanente\n\nTem certeza que deseja excluir o alerta "${alertTitle}"?\n\n• Esta ação não pode ser desfeita\n• O alerta será removido permanentemente\n• Os usuários não verão mais este alerta\n\nDeseja continuar?`)) {
      deleteAlert(alertId);
    }
  };

  const criticalAlerts = activeAlerts.filter(alert => alert.urgency === 'critical');
  const highAlerts = activeAlerts.filter(alert => alert.urgency === 'high');
  const otherAlerts = activeAlerts.filter(alert => !['critical', 'high'].includes(alert.urgency));

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
              <h1 className="text-lg text-gray-900">Alertas Ativos</h1>
              <p className="text-sm text-gray-600">
                {activeAlerts.length} alerta{activeAlerts.length !== 1 ? 's' : ''} 
                {activeAlerts.length !== 1 ? ' aguardando' : ' aguardando'} resolução
              </p>
            </div>
          </div>
          <Button
            onClick={onCreateAlert}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Novo Alerta
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-xl text-red-900 mb-1">{criticalAlerts.length}</p>
              <p className="text-xs text-red-700">Críticos</p>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-xl text-orange-900 mb-1">{highAlerts.length}</p>
              <p className="text-xs text-orange-700">Alta Prioridade</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xl text-blue-900 mb-1">{otherAlerts.length}</p>
              <p className="text-xs text-blue-700">Outros</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Alerts List */}
        {activeAlerts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">🎉 Nenhum Alerta Ativo!</h3>
              <p className="text-sm text-gray-600 mb-4">
                Parabéns! Todos os problemas foram resolvidos.
              </p>
              <Button
                onClick={onCreateAlert}
                variant="outline"
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Alerta
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Critical Alerts First */}
            {criticalAlerts.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h2 className="text-red-900">Alertas Críticos ({criticalAlerts.length})</h2>
                </div>
                <div className="space-y-3">
                  {criticalAlerts.map((alert) => (
                    <Card key={alert.id} className="border-l-4 border-l-red-500 bg-red-50/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(alert.category)}
                            <div>
                              <h3 className="text-gray-900 mb-1">{alert.title}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge className={`text-xs ${getUrgencyColor(alert.urgency)}`}>
                                  {getUrgencyIcon(alert.urgency)}
                                  <span className="ml-1">{alert.urgency.toUpperCase()}</span>
                                </Badge>
                                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                  {getTypeLabel(alert.category)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveAlert(alert.id, alert.title)}
                              className="text-green-600 border-green-300 hover:bg-green-50"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Resolver
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteAlert(alert.id, alert.title)}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                          {alert.description}
                        </p>

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
                </div>
              </div>
            )}

            {/* High Priority Alerts */}
            {highAlerts.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <h2 className="text-orange-900">Alta Prioridade ({highAlerts.length})</h2>
                </div>
                <div className="space-y-3">
                  {highAlerts.map((alert) => (
                    <Card key={alert.id} className="border-l-4 border-l-orange-500 bg-orange-50/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(alert.category)}
                            <div>
                              <h3 className="text-gray-900 mb-1">{alert.title}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge className={`text-xs ${getUrgencyColor(alert.urgency)}`}>
                                  {getUrgencyIcon(alert.urgency)}
                                  <span className="ml-1">{alert.urgency.toUpperCase()}</span>
                                </Badge>
                                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                  {getTypeLabel(alert.category)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveAlert(alert.id, alert.title)}
                              className="text-green-600 border-green-300 hover:bg-green-50"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Resolver
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteAlert(alert.id, alert.title)}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                          {alert.description}
                        </p>

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
                </div>
              </div>
            )}

            {/* Other Alerts */}
            {otherAlerts.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h2 className="text-blue-900">Outros Alertas ({otherAlerts.length})</h2>
                </div>
                <div className="space-y-3">
                  {otherAlerts.map((alert) => (
                    <Card key={alert.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(alert.category)}
                            <div>
                              <h3 className="text-gray-900 mb-1">{alert.title}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge className={`text-xs ${getUrgencyColor(alert.urgency)}`}>
                                  {getUrgencyIcon(alert.urgency)}
                                  <span className="ml-1">{alert.urgency.toUpperCase()}</span>
                                </Badge>
                                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                  {getTypeLabel(alert.category)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveAlert(alert.id, alert.title)}
                              className="text-green-600 border-green-300 hover:bg-green-50"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Resolver
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteAlert(alert.id, alert.title)}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                          {alert.description}
                        </p>

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
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}