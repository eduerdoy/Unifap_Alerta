import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  ArrowLeft, 
  AlertTriangle, 
  Shield, 
  Zap, 
  Wrench,
  Clock,
  MapPin,
  User,
  Calendar
} from "lucide-react";
import { useAlerts } from "./AlertContext";

interface ActiveAlertsViewProps {
  onBack: () => void;
}

export function ActiveAlertsView({ onBack }: ActiveAlertsViewProps) {
  const { getActiveAlerts } = useAlerts();
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
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Ativo</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return <Badge className="bg-red-600 text-white">Crítica</Badge>;
      case "high":
        return <Badge className="bg-orange-500 text-white">Alta</Badge>;
      case "medium":
        return <Badge className="bg-blue-500 text-white">Média</Badge>;
      case "low":
        return <Badge className="bg-gray-500 text-white">Baixa</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{urgency}</Badge>;
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

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="rounded-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-gray-900">Alertas Ativos</h1>
          <p className="text-sm text-gray-600">{activeAlerts.length} ocorrências em andamento</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-3 text-center">
            <p className="text-lg text-red-900 mb-1">
              {activeAlerts.filter(a => a.urgency === "critical").length}
            </p>
            <p className="text-xs text-red-700">Críticas</p>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-3 text-center">
            <p className="text-lg text-orange-900 mb-1">
              {activeAlerts.filter(a => a.urgency === "high").length}
            </p>
            <p className="text-xs text-orange-700">Alta Urgência</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      {activeAlerts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">Nenhum Alerta Ativo</h3>
            <p className="text-sm text-gray-500">
              Ótimas notícias! Não há problemas ativos no momento.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
            {activeAlerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 shadow-sm ${
              alert.createdBy === "Administrador" || alert.createdBy === "Admin Sistema" 
                ? "border-l-red-500 bg-red-50/30" 
                : "border-l-blue-500"
            }`}>
              <CardContent className="p-4">
                {/* Admin Alert Badge */}
                {(alert.createdBy === "Administrador" || alert.createdBy === "Admin Sistema") && (
                  <div className="flex items-center justify-center mb-3">
                    <Badge className="bg-red-600 text-white">
                      🔴 Alerta Oficial do Sistema
                    </Badge>
                  </div>
                )}
                
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(alert.category)}
                    <div>
                      <h3 className="text-gray-900 mb-1">{alert.title}</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {getTypeLabel(alert.category)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    {getStatusBadge(alert.status)}
                    {getUrgencyBadge(alert.urgency)}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                  {alert.description}
                </p>

                {/* Location */}
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {alert.location}
                </div>

                {/* Reporter and Time */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    Criado por {alert.createdBy}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {alert.timeAgo}
                  </div>
                </div>

                {/* Detailed Time */}
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  {alert.createdAt}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="text-center text-xs text-gray-500 mt-6 p-4">
        <p>Alertas atualizados em tempo real</p>
        <p>Última atualização: agora mesmo</p>
      </div>
    </div>
  );
}