import React, { useState } from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ExpenseList from './components/ExpenseList';
import AddExpenseModal from './components/AddExpenseModal';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ExpenseProvider>
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
      </div>
    </ExpenseProvider>
  );
}

export default App;
