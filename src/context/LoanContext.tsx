import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { Loan } from '../types';

interface LoanContextType {
  loans: Loan[];
  addLoan: (loan: Omit<Loan, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateLoan: (id: string, loan: Partial<Loan>) => Promise<void>;
  deleteLoan: (id: string) => Promise<void>;
  isLoading: boolean;
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export const LoanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchLoans();
    } else {
      setLoans([]);
    }
  }, [user]);

  const fetchLoans = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLoans(data || []);
    } catch (error) {
      toast.error('Failed to fetch loans');
      console.error('Error fetching loans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addLoan = async (loan: Omit<Loan, 'id' | 'created_at' | 'user_id'>) => {
    if (!user?.id) {
      toast.error('You must be logged in to create a loan');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('loans')
        .insert([{ ...loan, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setLoans(prev => [data, ...prev]);
      toast.success('Loan created successfully');
    } catch (error) {
      toast.error('Failed to create loan');
      console.error('Error adding loan:', error);
      throw error;
    }
  };

  const updateLoan = async (id: string, updates: Partial<Loan>) => {
    if (!user?.id) {
      toast.error('You must be logged in to update a loan');
      return;
    }

    try {
      const { error } = await supabase
        .from('loans')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setLoans(prev =>
        prev.map(loan => (loan.id === id ? { ...loan, ...updates } : loan))
      );
      toast.success('Loan updated successfully');
    } catch (error) {
      toast.error('Failed to update loan');
      console.error('Error updating loan:', error);
      throw error;
    }
  };

  const deleteLoan = async (id: string) => {
    if (!user?.id) {
      toast.error('You must be logged in to delete a loan');
      return;
    }

    try {
      const { error } = await supabase
        .from('loans')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setLoans(prev => prev.filter(loan => loan.id !== id));
    } catch (error) {
      toast.error('Failed to delete loan');
      console.error('Error deleting loan:', error);
      throw error;
    }
  };

  return (
    <LoanContext.Provider value={{ loans, addLoan, updateLoan, deleteLoan, isLoading }}>
      {children}
    </LoanContext.Provider>
  );
};

export const useLoan = () => {
  const context = useContext(LoanContext);
  if (context === undefined) {
    throw new Error('useLoan must be used within a LoanProvider');
  }
  return context;
};