import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  CheckCircle, 
  Shield, 
  Zap, 
  Wrench,
  Clock,
  MapPin,
  User,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { useAlerts } from "./AlertContext";

export function ResolvedAlertsView() {
  const { getResolvedAlerts } = useAlerts();
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

  const getUrgencyBadge = (urgency: string) => {
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

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Alertas Resolvidos</h1>
        <p className="text-sm text-gray-600">
          {resolvedAlerts.length} problema{resolvedAlerts.length !== 1 ? 's' : ''} já 
          {resolvedAlerts.length !== 1 ? ' foram' : ' foi'} solucionado{resolvedAlerts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Success Message */}
      {resolvedAlerts.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h3 className="text-green-900 mb-1">Parabéns! 🎉</h3>
              <p className="text-sm text-green-700">
                Nossa equipe tem trabalhado duro para resolver os problemas reportados.
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
              Quando os problemas forem solucionados, eles aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {resolvedAlerts.map((alert) => (
            <Card key={alert.id} className="border-l-4 border-l-green-500 bg-green-50/30">
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(alert.category)}
                    <div>
                      <h3 className="text-gray-900 mb-1">{alert.title}</h3>
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        {getTypeLabel(alert.category)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1 items-end">
                    <Badge className="bg-green-500 text-white">
                      ✅ Resolvido
                    </Badge>
                    {getUrgencyBadge(alert.urgency)}
                  </div>
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
                  alert.resolvedBy?.includes('Admin') || alert.resolvedBy?.includes('Administrador')
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-green-50 border-green-200'
                }`}>
                  <div className={`flex items-center text-sm mb-1 ${
                    alert.resolvedBy?.includes('Admin') || alert.resolvedBy?.includes('Administrador')
                      ? 'text-blue-800'
                      : 'text-green-800'
                  }`}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="font-medium">
                      {alert.resolvedBy?.includes('Admin') || alert.resolvedBy?.includes('Administrador')
                        ? '🔧 Resolvido pela Administração'
                        : 'Problema Solucionado'
                      }
                    </span>
                  </div>
                  {alert.resolvedBy && (
                    <div className={`flex items-center text-xs ${
                      alert.resolvedBy?.includes('Admin') || alert.resolvedBy?.includes('Administrador')
                        ? 'text-blue-700'
                        : 'text-green-700'
                    }`}>
                      <User className="w-3 h-3 mr-1" />
                      Resolvido por: {alert.resolvedBy}
                    </div>
                  )}
                  {alert.resolvedAt && (
                    <div className={`flex items-center text-xs mt-1 ${
                      alert.resolvedBy?.includes('Admin') || alert.resolvedBy?.includes('Administrador')
                        ? 'text-blue-600'
                        : 'text-green-600'
                    }`}>
                      <Calendar className="w-3 h-3 mr-1" />
                      {alert.resolvedAt}
                    </div>
                  )}
                  {(alert.resolvedBy?.includes('Admin') || alert.resolvedBy?.includes('Administrador')) && (
                    <div className="text-xs text-blue-600 mt-2 italic">
                      ⚡ Resolvido oficialmente pela equipe administrativa
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
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="text-center text-xs text-gray-500 mt-6 p-4">
        <p>Histórico de problemas solucionados</p>
        <p>Obrigado por ajudar a melhorar nosso campus! 🏫</p>
      </div>
    </div>
  );
}