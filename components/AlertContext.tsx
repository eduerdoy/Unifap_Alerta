import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Alert {
  id: number;
  type: string;
  title: string;
  description: string;
  location: string;
  createdBy: string;
  createdAt: string;
  timeAgo: string;
  status: 'active' | 'resolved';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  category: 'security' | 'maintenance' | 'infrastructure' | 'electrical' | 'emergency' | 'other';
  resolvedAt?: string;
  resolvedBy?: string;
}

interface AlertContextType {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'timeAgo' | 'status'>) => void;
  resolveAlert: (id: number, resolvedBy: string) => void;
  deleteAlert: (id: number) => void;
  getActiveAlerts: () => Alert[];
  getResolvedAlerts: () => Alert[];
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

const STORAGE_KEY = 'unifap-alerta-alerts';

// Alertas iniciais para demonstração
const initialAlerts: Alert[] = [
  {
    id: 1,
    type: "Elétrico",
    title: "Problema na Rede Elétrica",
    description: "Quedas de energia intermitentes no segundo andar. Várias salas ficando sem energia por períodos de 10-15 minutos.",
    location: "Bloco A - 2º Andar",
    createdBy: "Admin Sistema",
    createdAt: "12/08/2025 14:30",
    timeAgo: "há 2 horas",
    status: "active",
    urgency: "critical",
    category: "electrical"
  },
  {
    id: 2,
    type: "Segurança",
    title: "Iluminação Defeituosa",
    description: "Várias lâmpadas queimadas no estacionamento principal, causando pontos escuros que comprometem a segurança.",
    location: "Estacionamento Principal",
    createdBy: "Admin Sistema",
    createdAt: "12/08/2025 10:15",
    timeAgo: "há 6 horas",
    status: "active",
    urgency: "high",
    category: "security"
  },
  {
    id: 3,
    type: "Manutenção",
    title: "Banheiro Reformado",
    description: "Reforma completa do banheiro masculino da biblioteca foi finalizada com sucesso.",
    location: "Biblioteca Central",
    createdBy: "Admin Sistema",
    createdAt: "10/08/2025 16:00",
    timeAgo: "há 2 dias",
    status: "resolved",
    urgency: "medium",
    category: "maintenance",
    resolvedAt: "11/08/2025 14:00",
    resolvedBy: "Equipe Manutenção"
  }
];

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    // Tentar carregar dados do localStorage
    if (typeof window !== 'undefined') {
      try {
        const savedAlerts = localStorage.getItem(STORAGE_KEY);
        if (savedAlerts) {
          const parsed = JSON.parse(savedAlerts);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialAlerts;
        }
      } catch (error) {
        console.warn('Erro ao carregar alertas do localStorage:', error);
      }
    }
    return initialAlerts;
  });

  // Salvar no localStorage sempre que alerts mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
      } catch (error) {
        console.warn('Erro ao salvar alertas no localStorage:', error);
      }
    }
  }, [alerts]);

  const addAlert = (alertData: Omit<Alert, 'id' | 'createdAt' | 'timeAgo' | 'status'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: Date.now(),
      createdAt: new Date().toLocaleString('pt-BR'),
      timeAgo: "agora mesmo",
      status: "active"
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const resolveAlert = (id: number, resolvedBy: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id
          ? {
              ...alert,
              status: 'resolved' as const,
              resolvedAt: new Date().toLocaleString('pt-BR'),
              resolvedBy
            }
          : alert
      )
    );
  };

  const deleteAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getActiveAlerts = () => alerts.filter(alert => alert.status === 'active');
  
  const getResolvedAlerts = () => alerts.filter(alert => alert.status === 'resolved');

  return (
    <AlertContext.Provider value={{
      alerts,
      addAlert,
      resolveAlert,
      deleteAlert,
      getActiveAlerts,
      getResolvedAlerts
    }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
}