import React, { useState } from 'react';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ExpenseList from './components/ExpenseList';
import AddExpenseModal from './components/AddExpenseModal';
import { Bell, Plus, Moon, Sun } from 'lucide-react';
import './index.css';

const NotificationToast = () => {
  const { notifications } = useExpenses();
  
  return (
    <div style={{ 
      position: 'fixed', bottom: '6rem', right: '1.5rem', 
      zIndex: 2000, display: 'flex', flexDirection: 'column', gap: '0.5rem' 
    }}>
      {notifications.map(n => (
        <div key={n.id} className="clean-card" style={{ 
          padding: '1rem', background: 'var(--success)', color: 'white',
          border: 'none', minWidth: '280px',
          display: 'flex', alignItems: 'center', gap: '1rem',
          animation: 'slideIn 0.3s ease-out',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <Bell size={20} />
          <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{n.message}</span>
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
  const { loading, theme, toggleTheme } = useExpenses();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={{ flex: 1, padding: 'var(--space-xl)', overflowY: 'auto' }}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 'var(--space-xl)'
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
              {activeTab === 'dashboard' ? 'Overview' : 'Expenses'}
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
            <button 
              onClick={toggleTheme}
              className="secondary-button"
              style={{ padding: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            <button 
              className="primary-button desktop-only"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={20} /> Add Expense
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' ? <Dashboard /> : <ExpenseList />}
      </main>

      {/* Mobile Floating Action Button */}
      <button 
        className="mobile-only primary-button"
        onClick={() => setIsModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '5.5rem',
          right: '1.5rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 101,
        }}
      >
        <Plus size={28} />
      </button>

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
