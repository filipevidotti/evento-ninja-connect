
import { useState } from 'react';

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'payment';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  date: Date;
}

export interface FreelancerCheckout {
  id: string;
  freelancerId: string;
  freelancerName: string;
  eventId: string;
  eventTitle: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  checkoutDate: Date;
  approvedDate?: Date;
  rejectionReason?: string;
}

export interface ProducerWallet {
  balance: number;
  totalDeposited: number;
  totalSpent: number;
}

// Mock data
const mockWallet: ProducerWallet = {
  balance: 2500.00,
  totalDeposited: 5000.00,
  totalSpent: 2500.00
};

const mockTransactions: WalletTransaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 1000.00,
    description: 'Depósito via PIX',
    status: 'completed',
    date: new Date('2024-06-25')
  },
  {
    id: '2',
    type: 'payment',
    amount: -300.00,
    description: 'Pagamento para João Silva - Evento Casamento',
    status: 'completed',
    date: new Date('2024-06-24')
  },
  {
    id: '3',
    type: 'deposit',
    amount: 2000.00,
    description: 'Depósito via Cartão de Crédito',
    status: 'completed',
    date: new Date('2024-06-23')
  },
  {
    id: '4',
    type: 'payment',
    amount: -450.00,
    description: 'Pagamento para Maria Santos - Evento Corporativo',
    status: 'completed',
    date: new Date('2024-06-22')
  }
];

const mockCheckouts: FreelancerCheckout[] = [
  {
    id: '1',
    freelancerId: '1',
    freelancerName: 'João Silva',
    eventId: '1',
    eventTitle: 'Casamento Maria & João',
    amount: 400.00,
    description: 'Serviço de garçom - 8 horas',
    status: 'pending',
    checkoutDate: new Date('2024-06-26')
  },
  {
    id: '2',
    freelancerId: '2',
    freelancerName: 'Maria Santos',
    eventId: '2',
    eventTitle: 'Evento Corporativo ABC',
    amount: 350.00,
    description: 'Serviço de limpeza pós-evento',
    status: 'pending',
    checkoutDate: new Date('2024-06-26')
  },
  {
    id: '3',
    freelancerId: '3',
    freelancerName: 'Pedro Costa',
    eventId: '3',
    eventTitle: 'Festa de Aniversário',
    amount: 500.00,
    description: 'Segurança do evento - 10 horas',
    status: 'approved',
    checkoutDate: new Date('2024-06-25'),
    approvedDate: new Date('2024-06-25')
  }
];

export const useProducerFinance = () => {
  const [wallet, setWallet] = useState<ProducerWallet>(mockWallet);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(mockTransactions);
  const [checkouts, setCheckouts] = useState<FreelancerCheckout[]>(mockCheckouts);

  const addDeposit = (amount: number, description: string) => {
    const newTransaction: WalletTransaction = {
      id: Date.now().toString(),
      type: 'deposit',
      amount,
      description,
      status: 'pending',
      date: new Date()
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    // Simulate processing delay
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(t => 
          t.id === newTransaction.id 
            ? { ...t, status: 'completed' as const }
            : t
        )
      );
      setWallet(prev => ({
        ...prev,
        balance: prev.balance + amount,
        totalDeposited: prev.totalDeposited + amount
      }));
    }, 2000);
  };

  const approveCheckout = (checkoutId: string) => {
    setCheckouts(prev => 
      prev.map(checkout => 
        checkout.id === checkoutId 
          ? { ...checkout, status: 'approved', approvedDate: new Date() }
          : checkout
      )
    );
  };

  const rejectCheckout = (checkoutId: string, reason: string) => {
    setCheckouts(prev => 
      prev.map(checkout => 
        checkout.id === checkoutId 
          ? { ...checkout, status: 'rejected', rejectionReason: reason }
          : checkout
      )
    );
  };

  const payCheckout = (checkoutId: string) => {
    const checkout = checkouts.find(c => c.id === checkoutId);
    if (!checkout) return;

    // Create payment transaction
    const paymentTransaction: WalletTransaction = {
      id: Date.now().toString(),
      type: 'payment',
      amount: -checkout.amount,
      description: `Pagamento para ${checkout.freelancerName} - ${checkout.eventTitle}`,
      status: 'completed',
      date: new Date()
    };

    setTransactions(prev => [paymentTransaction, ...prev]);
    setWallet(prev => ({
      ...prev,
      balance: prev.balance - checkout.amount,
      totalSpent: prev.totalSpent + checkout.amount
    }));

    setCheckouts(prev => 
      prev.map(c => 
        c.id === checkoutId 
          ? { ...c, status: 'paid' }
          : c
      )
    );
  };

  const getPendingCheckouts = () => checkouts.filter(c => c.status === 'pending');
  const getApprovedCheckouts = () => checkouts.filter(c => c.status === 'approved');

  return {
    wallet,
    transactions,
    checkouts,
    addDeposit,
    approveCheckout,
    rejectCheckout,
    payCheckout,
    getPendingCheckouts,
    getApprovedCheckouts
  };
};
