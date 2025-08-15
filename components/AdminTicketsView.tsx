import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
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
  ArrowLeft,
  MessageSquare,
  Send,
  Eye,
  EyeOff,
  Megaphone,
  FileCheck,
  Trash2,
  TrendingUp
} from "lucide-react";
import { useTickets } from "./TicketContext";
import { useAlerts } from "./AlertContext";
import { useState } from "react";

interface User {
  email: string;
  name: string;
}

interface AdminTicketsViewProps {
  user: User | null;
  onBack: () => void;
}

export function AdminTicketsView({ user, onBack }: AdminTicketsViewProps) {
  const { getPendingTickets, getResolvedTickets, updateTicketStatus, markAsConvertedToAlert, deleteTicket } = useTickets();
  const { addAlert } = useAlerts();
  const [expandedTicket, setExpandedTicket] = useState<number | null>(null);
  const [convertingTickets, setConvertingTickets] = useState<Set<number>>(new Set());
  const [adminNotes, setAdminNotes] = useState<{[key: number]: string}>({});

  const pendingTickets = getPendingTickets();
  const resolvedTickets = getResolvedTickets();

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
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
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

  const handleConvertToPublicAlert = async (ticketId: number) => {
    const ticket = pendingTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    if (!window.confirm(`🔊 CONVERTER EM ALERTA PÚBLICO\n\nDeseja transformar este chamado em um alerta público?\n\n"${ticket.title}"\n\n• Todos os usuários verão este problema\n• O alerta aparecerá no mapa da UNIFAP\n• O estudante será notificado da ação\n\nProsseguir?`)) {
      return;
    }

    setConvertingTickets(prev => new Set(prev).add(ticketId));

    try {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Criar alerta público baseado no chamado
      const newAlert = {
        title: `📢 ${ticket.title}`,
        description: `${ticket.description}\n\n👤 Reportado originalmente por: ${ticket.createdBy}\n🔄 Convertido em alerta público pela administração`,
        category: ticket.category,
        urgency: ticket.urgency,
        location: ticket.location,
        createdBy: user?.name || 'Administrador'
      };

      const alertId = addAlert(newAlert);
      
      // Marcar ticket como convertido
      markAsConvertedToAlert(ticketId, alertId);

      alert(`✅ Sucesso!\n\nO chamado foi convertido em alerta público.\n\n• Alerta ID: #${alertId}\n• Todos os usuários foram notificados\n• O estudante pode acompanhar no mapa`);

    } catch (error) {
      alert("Erro ao converter chamado. Tente novamente.");
    } finally {
      setConvertingTickets(prev => {
        const newSet = new Set(prev);
        newSet.delete(ticketId);
        return newSet;
      });
    }
  };

  const handleResolveTicket = (ticketId: number, ticketTitle: string) => {
    const notes = adminNotes[ticketId] || '';
    
    if (!window.confirm(`✅ RESOLVER CHAMADO\n\nMarcar "${ticketTitle}" como resolvido?\n\n${notes ? `Notas: ${notes}\n\n` : ''}• O estudante será notificado\n• O chamado sairá da lista pendente\n\nConfirmar resolução?`)) {
      return;
    }

    updateTicketStatus(ticketId, 'resolved', notes, user?.name || 'Administrador');
    setAdminNotes(prev => ({ ...prev, [ticketId]: '' }));
  };

  const handleDeleteTicket = (ticketId: number, ticketTitle: string) => {
    if (window.confirm(`🗑️ EXCLUIR CHAMADO\n\nTem certeza que deseja excluir permanentemente o chamado "${ticketTitle}"?\n\n• Esta ação não pode ser desfeita\n• O estudante não será notificado\n• Use apenas para spam ou chamados inválidos\n\nExcluir mesmo assim?`)) {
      deleteTicket(ticketId);
    }
  };

  const criticalTickets = pendingTickets.filter(ticket => ticket.urgency === 'critical');
  const highTickets = pendingTickets.filter(ticket => ticket.urgency === 'high');
  const otherTickets = pendingTickets.filter(ticket => !['critical', 'high'].includes(ticket.urgency));

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
              <h1 className="text-lg text-gray-900">📋 Chamados Recebidos</h1>
              <p className="text-sm text-gray-600">
                {pendingTickets.length} chamado{pendingTickets.length !== 1 ? 's' : ''} aguardando análise
              </p>
            </div>
          </div>
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
              <p className="text-xl text-red-900 mb-1">{criticalTickets.length}</p>
              <p className="text-xs text-red-700">Críticos</p>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-xl text-orange-900 mb-1">{highTickets.length}</p>
              <p className="text-xs text-orange-700">Alta Prioridade</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xl text-green-900 mb-1">{resolvedTickets.length}</p>
              <p className="text-xs text-green-700">Resolvidos</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Tickets */}
        {pendingTickets.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-600 mb-2">🎉 Nenhum Chamado Pendente!</h3>
              <p className="text-sm text-gray-500">
                Todos os chamados foram analisados. Bom trabalho!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            
            {/* Critical Tickets First */}
            {criticalTickets.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h2 className="text-red-900">🚨 Chamados Críticos ({criticalTickets.length})</h2>
                </div>
                <div className="space-y-3">
                  {criticalTickets.map((ticket) => (
                    <Card key={ticket.id} className="border-l-4 border-l-red-500 bg-red-50/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(ticket.category)}
                            <div>
                              <h3 className="text-gray-900 mb-1">{ticket.title}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge className={`text-xs ${getUrgencyColor(ticket.urgency)}`}>
                                  🔥 {ticket.urgency.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                  {getTypeLabel(ticket.category)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            {expandedTicket === ticket.id ? 
                              <EyeOff className="w-4 h-4" /> : 
                              <Eye className="w-4 h-4" />
                            }
                          </button>
                        </div>

                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                          {ticket.description}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {ticket.location}
                          </div>
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {ticket.createdBy}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {ticket.createdAt}
                          </div>
                        </div>

                        {expandedTicket === ticket.id && (
                          <div className="border-t pt-3 space-y-3">
                            <div>
                              <label className="text-sm text-gray-700 mb-1 block">Notas Administrativas:</label>
                              <Textarea
                                value={adminNotes[ticket.id] || ''}
                                onChange={(e) => setAdminNotes(prev => ({
                                  ...prev,
                                  [ticket.id]: e.target.value
                                }))}
                                placeholder="Adicione observações sobre a resolução..."
                                rows={2}
                                className="text-sm"
                              />
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleConvertToPublicAlert(ticket.id)}
                                disabled={convertingTickets.has(ticket.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                {convertingTickets.has(ticket.id) ? (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Convertendo...</span>
                                  </div>
                                ) : (
                                  <>
                                    <Megaphone className="w-4 h-4 mr-1" />
                                    Tornar Público
                                  </>
                                )}
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResolveTicket(ticket.id, ticket.title)}
                                className="text-green-600 border-green-300 hover:bg-green-50"
                              >
                                <FileCheck className="w-4 h-4 mr-1" />
                                Resolver Privado
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteTicket(ticket.id, ticket.title)}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* High Priority Tickets */}
            {highTickets.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <h2 className="text-orange-900">⚡ Alta Prioridade ({highTickets.length})</h2>
                </div>
                <div className="space-y-3">
                  {highTickets.map((ticket) => (
                    <Card key={ticket.id} className="border-l-4 border-l-orange-500 bg-orange-50/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(ticket.category)}
                            <div>
                              <h3 className="text-gray-900 mb-1">{ticket.title}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge className={`text-xs ${getUrgencyColor(ticket.urgency)}`}>
                                  ⚡ {ticket.urgency.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                  {getTypeLabel(ticket.category)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            {expandedTicket === ticket.id ? 
                              <EyeOff className="w-4 h-4" /> : 
                              <Eye className="w-4 h-4" />
                            }
                          </button>
                        </div>

                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                          {ticket.description}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {ticket.location}
                          </div>
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {ticket.createdBy}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {ticket.createdAt}
                          </div>
                        </div>

                        {expandedTicket === ticket.id && (
                          <div className="border-t pt-3 space-y-3">
                            <div>
                              <label className="text-sm text-gray-700 mb-1 block">Notas Administrativas:</label>
                              <Textarea
                                value={adminNotes[ticket.id] || ''}
                                onChange={(e) => setAdminNotes(prev => ({
                                  ...prev,
                                  [ticket.id]: e.target.value
                                }))}
                                placeholder="Adicione observações sobre a resolução..."
                                rows={2}
                                className="text-sm"
                              />
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleConvertToPublicAlert(ticket.id)}
                                disabled={convertingTickets.has(ticket.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                {convertingTickets.has(ticket.id) ? (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Convertendo...</span>
                                  </div>
                                ) : (
                                  <>
                                    <Megaphone className="w-4 h-4 mr-1" />
                                    Tornar Público
                                  </>
                                )}
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResolveTicket(ticket.id, ticket.title)}
                                className="text-green-600 border-green-300 hover:bg-green-50"
                              >
                                <FileCheck className="w-4 h-4 mr-1" />
                                Resolver Privado
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteTicket(ticket.id, ticket.title)}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Other Tickets */}
            {otherTickets.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h2 className="text-blue-900">📋 Outros Chamados ({otherTickets.length})</h2>
                </div>
                <div className="space-y-3">
                  {otherTickets.map((ticket) => (
                    <Card key={ticket.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(ticket.category)}
                            <div>
                              <h3 className="text-gray-900 mb-1">{ticket.title}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge className={`text-xs ${getUrgencyColor(ticket.urgency)}`}>
                                  {ticket.urgency.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                  {getTypeLabel(ticket.category)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            {expandedTicket === ticket.id ? 
                              <EyeOff className="w-4 h-4" /> : 
                              <Eye className="w-4 h-4" />
                            }
                          </button>
                        </div>

                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                          {ticket.description}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {ticket.location}
                          </div>
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {ticket.createdBy}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {ticket.createdAt}
                          </div>
                        </div>

                        {expandedTicket === ticket.id && (
                          <div className="border-t pt-3 space-y-3">
                            <div>
                              <label className="text-sm text-gray-700 mb-1 block">Notas Administrativas:</label>
                              <Textarea
                                value={adminNotes[ticket.id] || ''}
                                onChange={(e) => setAdminNotes(prev => ({
                                  ...prev,
                                  [ticket.id]: e.target.value
                                }))}
                                placeholder="Adicione observações sobre a resolução..."
                                rows={2}
                                className="text-sm"
                              />
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleConvertToPublicAlert(ticket.id)}
                                disabled={convertingTickets.has(ticket.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                {convertingTickets.has(ticket.id) ? (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Convertendo...</span>
                                  </div>
                                ) : (
                                  <>
                                    <Megaphone className="w-4 h-4 mr-1" />
                                    Tornar Público
                                  </>
                                )}
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResolveTicket(ticket.id, ticket.title)}
                                className="text-green-600 border-green-300 hover:bg-green-50"
                              >
                                <FileCheck className="w-4 h-4 mr-1" />
                                Resolver Privado
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteTicket(ticket.id, ticket.title)}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center text-xs text-gray-500 mt-6 p-4">
          <p>💡 <strong>Dica:</strong> Chamados críticos devem ser convertidos em alertas públicos</p>
          <p>📞 Sistema de Chamados UNIFAP Alerta</p>
        </div>
      </div>
    </div>
  );
}