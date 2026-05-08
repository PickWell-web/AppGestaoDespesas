import React, { createContext, useContext, useState, useEffect } from 'react';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) return JSON.parse(saved);
    
    // Initial dummy data
    const initialData = [
      { id: 1, description: 'Lunch with Clients', amount: 45.50, date: new Date().toISOString().split('T')[0], category: 'Food', type: 'legitimate_self', workerId: 1, invoiceNumber: 'FT 2024/101' },
      { id: 2, description: 'Fuel Refill', amount: 60.00, date: new Date().toISOString().split('T')[0], category: 'Transport', type: 'legitimate_card', workerId: 1, invoiceNumber: 'FT 2024/102' },
      { id: 3, description: 'Office Supplies', amount: 25.00, date: new Date().toISOString().split('T')[0], category: 'Office', type: 'false', workerId: 1, invoiceNumber: 'FT 2024/103' },
      { id: 4, description: 'Software Subscription', amount: 15.99, date: new Date().toISOString().split('T')[0], category: 'Software', type: 'legitimate_card', workerId: 2, invoiceNumber: 'FT 2024/201' },
    ];
    return initialData;
  });

  const [workers, setWorkers] = useState(() => {
    const saved = localStorage.getItem('workers');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Gonçalo Andrade', budget: 500 },
      { id: 2, name: 'Simão Coimbra', budget: 500 }
    ];
  });

  const [currentWorkerId, setCurrentWorkerId] = useState(1);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('workers', JSON.stringify(workers));
  }, [workers]);

  const addExpense = (expense) => {
    setExpenses(prev => [...prev, { ...expense, id: Date.now(), createdAt: new Date().toISOString() }]);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const updateExpense = (updatedExpense) => {
    setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));
  };

  const getWorkerStats = (workerId) => {
    const workerExpenses = expenses.filter(e => e.workerId === workerId);
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
      .filter(e => e.type === 'false' || e.type === 'false_self' || e.type === 'false_card')
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
      workers,
      currentWorkerId,
      setCurrentWorkerId,
      addExpense,
      deleteExpense,
      updateExpense,
      getWorkerStats,
      setWorkers
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpenseContext);
