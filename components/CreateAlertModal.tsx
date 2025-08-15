import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AlertTriangle, MapPin, Send, Users } from "lucide-react";
import { useAlerts } from "./AlertContext";

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAlertModal({ isOpen, onClose }: CreateAlertModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addAlert, getActiveAlerts } = useAlerts();
  const activeAlerts = getActiveAlerts();

  const handleSubmit = async () => {
    if (!title || !description || !location || !category) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    
    // Simular envio
    setTimeout(() => {
      addAlert({
        type: getCategoryLabel(category),
        title,
        description,
        location,
        category: category as any,
        urgency: urgency as any,
        createdBy: "Administrador"
      });
      
      setIsSubmitting(false);
      
      // Mostrar confirmação de sucesso
      const alertCount = activeAlerts.length + 1;
      const message = `🎯 ALERTA CRIADO COM SUCESSO!\n\n` +
                     `📋 Título: "${title}"\n` +
                     `🚨 Urgência: ${urgency.toUpperCase()}\n` +
                     `📍 Local: ${location}\n\n` +
                     `✅ Status: Enviado para todos os alunos\n` +
                     `📊 Total de alertas ativos: ${alertCount}\n\n` +
                     `⚡ Os alunos receberão notificação imediata!`;
      alert(message);
      
      // Reset form
      setTitle("");
      setDescription("");
      setLocation("");
      setCategory("");
      setUrgency("medium");
      onClose();
    }, 2000);
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'security': return 'Segurança';
      case 'maintenance': return 'Manutenção';
      case 'infrastructure': return 'Infraestrutura';
      case 'electrical': return 'Elétrico';
      case 'emergency': return 'Emergência';
      case 'other': return 'Outros';
      default: return cat;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-center">Novo Alerta do Sistema</DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Este alerta será enviado para todos os usuários do sistema
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Alert Title */}
          <div className="space-y-2">
            <Label>Título do Alerta *</Label>
            <Input
              placeholder="Ex: Manutenção programada no sistema elétrico"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 rounded-xl"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 text-right">
              {title.length}/100 caracteres
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Categoria *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="security">🛡️ Segurança</SelectItem>
                <SelectItem value="maintenance">🔧 Manutenção</SelectItem>
                <SelectItem value="infrastructure">🏗️ Infraestrutura</SelectItem>
                <SelectItem value="electrical">⚡ Elétrico</SelectItem>
                <SelectItem value="emergency">🚨 Emergência</SelectItem>
                <SelectItem value="other">📋 Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Local Afetado *</Label>
            <div className="relative">
              <Input
                placeholder="Ex: Todo o campus, Bloco A, Biblioteca..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 pl-10 rounded-xl"
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Descrição Detalhada *</Label>
            <Textarea
              placeholder="Descreva o problema, impactos e ações sendo tomadas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] rounded-xl resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right">
              {description.length}/500 caracteres
            </p>
          </div>

          {/* Urgency Level */}
          <div className="space-y-2">
            <Label>Nível de Urgência</Label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">🟢 Baixa - Informativo</SelectItem>
                <SelectItem value="medium">🟡 Média - Atenção necessária</SelectItem>
                <SelectItem value="high">🟠 Alta - Problema sério</SelectItem>
                <SelectItem value="critical">🔴 Crítica - Emergência</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Impact Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">Alcance do Alerta</span>
            </div>
            <p className="text-xs text-blue-700">
              Este alerta será enviado para aproximadamente 150 usuários ativos no sistema
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !title || !description || !location || !category}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl active:scale-95 transition-all"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Enviando Alerta...
                </div>
              ) : (
                <div className="flex items-center">
                  <Send className="w-4 h-4 mr-2" />
                  Lançar Alerta
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