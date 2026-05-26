import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const WORKER_EMAIL_MAP = {
  'sc@crest-cp.com': 2,
};

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [workers, setWorkers] = useState([
    { id: 1, name: 'Gonçalo Andrade', budget: 500 },
    { id: 2, name: 'Simão Coimbra', budget: 500 }
  ]);

  const defaultWorkerId = WORKER_EMAIL_MAP[user?.email] ?? 1;
  const [currentWorkerId, setCurrentWorkerId] = useState(defaultWorkerId);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fetch initial data
  useEffect(() => {
    const fetchExpenses = async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });
      
      if (!error) {
        setExpenses(data);
      }
      setLoading(false);
    };

    fetchExpenses();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('expenses_changes')
      .on('postgres_changes', { event: '*', table: 'expenses' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setExpenses(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setExpenses(prev => prev.map(e => e.id === payload.new.id ? payload.new : e));
          
          if (payload.new.status === 'approved' && payload.old.status !== 'approved') {
            addNotification({
              id: Date.now(),
              message: `Expense "${payload.new.description}" has been approved!`,
              type: 'success'
            });
          }
        } else if (payload.eventType === 'DELETE') {
          setExpenses(prev => prev.filter(e => e.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const addNotification = (notif) => {
    setNotifications(prev => [notif, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notif.id));
    }, 5000);
  };

  const addExpense = async (expense, file) => {
    let receipt_url = null;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);
      
      receipt_url = publicUrl;
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert([{ ...expense, status: 'pending', reimbursed: false, receipt_url }])
      .select();
    return { data, error };
  };

  const deleteExpense = async (id) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    return { error };
  };

  const updateExpense = async (updatedExpense) => {
    const { data, error } = await supabase
      .from('expenses')
      .update(updatedExpense)
      .eq('id', updatedExpense.id)
      .select();
    return { data, error };
  };

  const getWorkerStats = (workerId) => {
    const workerExpenses = expenses.filter(e => e.worker_id === workerId);
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    
    const monthlyExpenses = workerExpenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const legitimateSelf = monthlyExpenses
      .filter(e => e.type === 'legitimate_self')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const legitimateCard = monthlyExpenses
      .filter(e => e.type === 'legitimate_card')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const falseExpenses = monthlyExpenses
      .filter(e => e.type === 'false_self' || e.type === 'false_card')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const worker = workers.find(w => w.id === workerId);
    const budgetRemaining = (worker?.budget || 0) - falseExpenses;

    return {
      legitimateSelf,
      legitimateCard,
      falseExpenses,
      budgetRemaining,
      total: legitimateSelf + legitimateCard + falseExpenses
    };
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      loading,
      workers,
      currentWorkerId,
      setCurrentWorkerId,
      addExpense,
      deleteExpense,
      updateExpense,
      getWorkerStats,
      notifications,
      theme,
      setTheme,
      toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpenseContext);
