import React, { useState } from 'react';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ExpenseList from './components/ExpenseList';
import AddExpenseModal from './components/AddExpenseModal';
import { Bell } from 'lucide-react';
import './index.css';

const NotificationToast = () => {
  const { notifications } = useExpenses();
  
  return (
    <div style={{ 
      position: 'fixed', bottom: '1.5rem', right: '1.5rem', 
      zIndex: 2000, display: 'flex', flexDirection: 'column', gap: '0.5rem' 
    }}>
      {notifications.map(n => (
        <div key={n.id} className="glass-card" style={{ 
          padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', 
          border: '1px solid var(--success)', minWidth: '300px',
          display: 'flex', alignItems: 'center', gap: '1rem',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <Bell size={20} color="var(--success)" />
          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{n.message}</span>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading } = useExpenses();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div className="premium-text-gradient" style={{ fontSize: '1.5rem', fontWeight: '800' }}>Loading Expenses...</div>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={{ flex: 1, padding: 'var(--space-xl)', overflowY: 'auto' }}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 'var(--space-xl)' 
        }}>
          <div>
            <h1 className="premium-text-gradient" style={{ fontSize: '2rem', fontWeight: '800' }}>
              Expense Manager
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your company finances with ease.</p>
          </div>
          
          <button 
            className="premium-gradient"
            onClick={() => setIsModalOpen(true)}
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '0.75rem', 
              color: 'white', 
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
            }}
          >
            <span>+</span> New Expense
          </button>
        </header>

        {activeTab === 'dashboard' ? <Dashboard /> : <ExpenseList />}
      </main>

      {isModalOpen && <AddExpenseModal onClose={() => setIsModalOpen(false)} />}
      <NotificationToast />
    </div>
  );
}

function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}

export default App;
