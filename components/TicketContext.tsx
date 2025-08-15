import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  category: 'electrical' | 'security' | 'infrastructure' | 'maintenance' | 'emergency' | 'other';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  createdBy: string;
  createdAt: string;
  status: 'pending' | 'in_review' | 'resolved' | 'converted_to_alert';
  adminNotes?: string;
  convertedToAlertId?: number;
  resolvedAt?: string;
  resolvedBy?: string;
  images?: string[];
}

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'status'>) => void;
  updateTicketStatus: (ticketId: number, status: Ticket['status'], adminNotes?: string, resolvedBy?: string) => void;
  markAsConvertedToAlert: (ticketId: number, alertId: number) => void;
  getPendingTickets: () => Ticket[];
  getResolvedTickets: () => Ticket[];
  deleteTicket: (ticketId: number) => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function TicketProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Carregar tickets do localStorage na inicialização
  useEffect(() => {
    const savedTickets = localStorage.getItem('unifap-tickets');
    if (savedTickets) {
      try {
        const parsedTickets = JSON.parse(savedTickets);
        setTickets(parsedTickets);
        console.log('Tickets carregados do localStorage:', parsedTickets);
      } catch (error) {
        console.error('Erro ao carregar tickets:', error);
      }
    } else {
      // Criar alguns tickets de exemplo se não houver dados salvos
      const exampleTickets: Ticket[] = [
        {
          id: 1,
          title: "Lâmpada queimada na Biblioteca",
          description: "A lâmpada da mesa 15 na biblioteca está piscando e depois apaga. Está atrapalhando os estudos.",
          category: 'electrical',
          urgency: 'medium',
          location: 'Biblioteca Central',
          createdBy: 'MARIA SILVA',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString('pt-BR'),
          status: 'pending'
        },
        {
          id: 2,
          title: "Vazamento no banheiro do Bloco A",
          description: "Há um vazamento grande no banheiro masculino do 2º andar do Bloco A. A água está acumulando no chão e pode causar acidentes.",
          category: 'infrastructure',
          urgency: 'high',
          location: 'Banheiros - Bloco A',
          createdBy: 'JOÃO SANTOS',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toLocaleString('pt-BR'),
          status: 'pending'
        }
      ];
      setTickets(exampleTickets);
      localStorage.setItem('unifap-tickets', JSON.stringify(exampleTickets));
    }
  }, []);

  // Salvar tickets no localStorage quando houver mudanças
  useEffect(() => {
    localStorage.setItem('unifap-tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Sincronizar tickets quando outra aba/guia atualizar o localStorage
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'unifap-tickets') {
        try {
          const next = e.newValue ? JSON.parse(e.newValue) : [];
          setTickets(Array.isArray(next) ? next : []);
          console.log('Tickets sincronizados via storage event:', next);
        } catch (err) {
          console.error('Erro ao sincronizar tickets do storage:', err);
        }
      }
    };

    const refreshFromStorage = () => {
      try {
        const saved = localStorage.getItem('unifap-tickets');
        if (saved) {
          const parsed = JSON.parse(saved);
          setTickets(Array.isArray(parsed) ? parsed : []);
          console.log('Tickets recarregados ao focar a aba:', parsed);
        }
      } catch (err) {
        console.error('Erro ao recarregar tickets ao focar:', err);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', refreshFromStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', refreshFromStorage);
    };
  }, []);

  const addTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'status'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now(),
      createdAt: new Date().toLocaleString('pt-BR'),
      status: 'pending'
    };
    
    console.log('Adicionando novo ticket:', newTicket);
    setTickets(prev => {
      const updated = [newTicket, ...prev];
      try {
        localStorage.setItem('unifap-tickets', JSON.stringify(updated));
      } catch (err) {
        console.error('Erro ao salvar tickets no localStorage (add):', err);
      }
      console.log('Tickets atualizados:', updated);
      return updated;
    });
  };

  const updateTicketStatus = (
    ticketId: number, 
    status: Ticket['status'], 
    adminNotes?: string,
    resolvedBy?: string
  ) => {
    setTickets(prev => {
      const updated = prev.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              status, 
              adminNotes,
              resolvedBy,
              resolvedAt: status === 'resolved' ? new Date().toLocaleString('pt-BR') : ticket.resolvedAt
            }
          : ticket
      );
      try {
        localStorage.setItem('unifap-tickets', JSON.stringify(updated));
      } catch (err) {
        console.error('Erro ao salvar tickets no localStorage (updateStatus):', err);
      }
      return updated;
    });
  };

  const markAsConvertedToAlert = (ticketId: number, alertId: number) => {
    setTickets(prev => {
      const updated = prev.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              status: 'converted_to_alert' as const,
              convertedToAlertId: alertId,
              resolvedAt: new Date().toLocaleString('pt-BR')
            }
          : ticket
      );
      try {
        localStorage.setItem('unifap-tickets', JSON.stringify(updated));
      } catch (err) {
        console.error('Erro ao salvar tickets no localStorage (convertToAlert):', err);
      }
      return updated;
    });
  };

  const getPendingTickets = () => {
    return tickets.filter(ticket => ticket.status === 'pending' || ticket.status === 'in_review');
  };

  const getResolvedTickets = () => {
    return tickets.filter(ticket => ticket.status === 'resolved' || ticket.status === 'converted_to_alert');
  };

  const deleteTicket = (ticketId: number) => {
    setTickets(prev => {
      const updated = prev.filter(ticket => ticket.id !== ticketId);
      try {
        localStorage.setItem('unifap-tickets', JSON.stringify(updated));
      } catch (err) {
        console.error('Erro ao salvar tickets no localStorage (delete):', err);
      }
      return updated;
    });
  };

  return (
    <TicketContext.Provider value={{
      tickets,
      addTicket,
      updateTicketStatus,
      markAsConvertedToAlert,
      getPendingTickets,
      getResolvedTickets,
      deleteTicket
    }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets deve ser usado dentro de um TicketProvider');
  }
  return context;
}