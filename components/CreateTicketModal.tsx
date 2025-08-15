import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select } from "./ui/select";
import { Badge } from "./ui/badge";
import { 
  X, 
  Send, 
  MapPin, 
  AlertTriangle, 
  Shield, 
  Zap, 
  Wrench, 
  Clock,
  HelpCircle,
  Camera,
  CheckCircle
} from "lucide-react";
import { useTickets } from "./TicketContext";

interface User {
  email: string;
  name: string;
}

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function CreateTicketModal({ isOpen, onClose, user }: CreateTicketModalProps) {
  const { addTicket } = useTickets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as "electrical" | "security" | "infrastructure" | "maintenance" | "emergency" | "other",
    urgency: "" as "low" | "medium" | "high" | "critical",
    location: ""
  });

  const categories = [
    { value: "electrical", label: "Problema Elétrico", icon: <Zap className="w-4 h-4" />, color: "text-yellow-600" },
    { value: "security", label: "Segurança", icon: <Shield className="w-4 h-4" />, color: "text-red-600" },
    { value: "infrastructure", label: "Infraestrutura", icon: <AlertTriangle className="w-4 h-4" />, color: "text-orange-600" },
    { value: "maintenance", label: "Manutenção", icon: <Wrench className="w-4 h-4" />, color: "text-blue-600" },
    { value: "emergency", label: "Emergência", icon: <AlertTriangle className="w-4 h-4" />, color: "text-red-700" },
    { value: "other", label: "Outro", icon: <HelpCircle className="w-4 h-4" />, color: "text-gray-600" }
  ];

  const urgencyLevels = [
    { value: "low", label: "Baixa", color: "bg-gray-100 text-gray-700", description: "Pode aguardar" },
    { value: "medium", label: "Média", color: "bg-blue-100 text-blue-700", description: "Importante" },
    { value: "high", label: "Alta", color: "bg-orange-100 text-orange-700", description: "Urgente" },
    { value: "critical", label: "Crítica", color: "bg-red-100 text-red-700", description: "Imediato" }
  ];

  const commonLocations = [
    "Biblioteca Central",
    "Bloco A - Salas de Aula", 
    "Bloco B - Laboratórios",
    "Bloco C - Administração",
    "Cantina/Refeitório",
    "Auditório Principal",
    "Ginásio de Esportes",
    "Estacionamento",
    "Banheiros - Bloco A",
    "Banheiros - Bloco B", 
    "Área Externa/Pátio",
    "Portaria/Entrada"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.urgency || !formData.location) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Debug: log dos dados que serão enviados
      const ticketData = {
        ...formData,
        createdBy: user?.name || 'Estudante'
      };
      console.log('Enviando ticket:', ticketData);

      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 1500));

      addTicket(ticketData);
      console.log('Ticket adicionado com sucesso!');

      setShowSuccess(true);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "" as any,
        urgency: "" as any,
        location: ""
      });

      // Fechar modal após mostrar sucesso
      setTimeout(() => {
        setShowSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 2000);

    } catch (error) {
      alert("Erro ao enviar chamado. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h3 className="text-green-900 mb-2">🎉 Chamado Enviado!</h3>
            <p className="text-sm text-green-700 mb-4">
              Seu chamado foi enviado com sucesso para a administração. Você receberá uma resposta em breve.
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-green-600">
              <Clock className="w-3 h-3" />
              <span>Tempo médio de resposta: 2-4 horas</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">📋 Enviar Chamado</CardTitle>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700 active:scale-95 transition-all"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Relate um problema para a administração resolver
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Título */}
            <div>
              <Label htmlFor="title" className="text-gray-900 mb-2 block">
                Título do Problema *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Descreva o problema em poucas palavras"
                className="w-full"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Categoria */}
            <div>
              <Label className="text-gray-900 mb-3 block">Categoria *</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setFormData({...formData, category: category.value as any})}
                    disabled={isSubmitting}
                    className={`p-3 border rounded-lg text-left transition-all active:scale-95 ${
                      formData.category === category.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={category.color}>{category.icon}</span>
                      <span className="text-sm text-gray-900">{category.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Urgência */}
            <div>
              <Label className="text-gray-900 mb-3 block">Nível de Urgência *</Label>
              <div className="space-y-2">
                {urgencyLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setFormData({...formData, urgency: level.value as any})}
                    disabled={isSubmitting}
                    className={`w-full p-3 border rounded-lg text-left transition-all active:scale-95 ${
                      formData.urgency === level.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge className={`text-xs ${level.color} mb-1`}>
                          {level.label}
                        </Badge>
                        <p className="text-xs text-gray-600">{level.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Localização */}
            <div>
              <Label htmlFor="location" className="text-gray-900 mb-2 block">
                Localização *
              </Label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-lg bg-white"
                disabled={isSubmitting}
                required
              >
                <option value="">Selecione o local</option>
                {commonLocations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
                <option value="custom">Outro local (especificar na descrição)</option>
              </select>
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="description" className="text-gray-900 mb-2 block">
                Descrição Detalhada *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva o problema em detalhes. Inclua informações como: quando aconteceu, com que frequência, se há riscos, etc."
                rows={4}
                className="w-full"
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Quanto mais detalhes, melhor poderemos ajudar
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-700">
                  <p className="mb-1"><strong>📱 Seu chamado será:</strong></p>
                  <ul className="space-y-1 ml-4">
                    <li>• Enviado diretamente para a administração</li>
                    <li>• Analisado pela equipe responsável</li>
                    <li>• Pode ser transformado em alerta público se necessário</li>
                    <li>• Respondido em até 4 horas úteis</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.description || !formData.category || !formData.urgency || !formData.location}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Enviando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Enviar Chamado</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}