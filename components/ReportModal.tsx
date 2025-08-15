import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MapPin, Send } from "lucide-react";
import { useTickets } from "./TicketContext";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: { email: string; name: string } | null;
}

export function ReportModal({ isOpen, onClose, user }: ReportModalProps) {
  const [reportType, setReportType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTicket } = useTickets();

  const handleSubmit = async () => {
    if (!reportType || !location || !description) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Criar o ticket
      const ticketData = {
        title: `${reportType === 'security' ? 'Segurança' :
               reportType === 'infrastructure' ? 'Infraestrutura' :
               reportType === 'maintenance' ? 'Manutenção' :
               reportType === 'electrical' ? 'Problema Elétrico' :
               reportType === 'plumbing' ? 'Problema Hidráulico' :
               reportType === 'cleanliness' ? 'Limpeza' : 'Outros'} - ${location}`,
        description,
        category: reportType as any,
        urgency: priority as any,
        location,
        createdBy: user?.name || 'Estudante'
      };

      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addTicket(ticketData);
      console.log('Chamado enviado via ReportModal:', ticketData);

      alert("✅ Chamado enviado com sucesso!\n\nSeu chamado foi enviado para o administrador e será analisado em breve. Obrigado por contribuir com a melhoria da UNIFAP!");
      
      // Limpar formulário
      setReportType("");
      setLocation("");
      setDescription("");
      setPriority("medium");
      onClose();
    } catch (error) {
      console.error('Erro ao enviar chamado:', error);
      alert("❌ Erro ao enviar chamado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-center">📋 Enviar Chamado</DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Relate um problema no campus diretamente para o administrador
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Report Type */}
          <div className="space-y-2">
            <Label>Tipo de Ocorrência *</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="security">Problema de Segurança</SelectItem>
                <SelectItem value="infrastructure">Infraestrutura</SelectItem>
                <SelectItem value="maintenance">Manutenção</SelectItem>
                <SelectItem value="cleanliness">Limpeza</SelectItem>
                <SelectItem value="electrical">Elétrico</SelectItem>
                <SelectItem value="plumbing">Hidráulico</SelectItem>
                <SelectItem value="other">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Local da Ocorrência *</Label>
            <div className="relative">
              <Input
                placeholder="Ex: Bloco A, 2º andar, sala 201"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 pl-10 rounded-xl"
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Descrição *</Label>
            <Textarea
              placeholder="Descreva detalhadamente o problema encontrado..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] rounded-xl resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right">
              {description.length}/500 caracteres
            </p>
          </div>



          {/* Priority Level */}
          <div className="space-y-2">
            <Label>Nível de Urgência</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa - Não urgente</SelectItem>
                <SelectItem value="medium">Média - Precisa de atenção</SelectItem>
                <SelectItem value="high">Alta - Problema sério</SelectItem>
                <SelectItem value="critical">Crítica - Emergência</SelectItem>
              </SelectContent>
            </Select>
          </div>



          {/* Submit Button */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !reportType || !location || !description}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl active:scale-95 transition-all shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Enviando para o Administrador...
                </div>
              ) : (
                <div className="flex items-center">
                  <Send className="w-5 h-5 mr-3" />
                  📋 Enviar Chamado para Administrador
                </div>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full h-12 rounded-xl"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}