import React from 'react';
import { LayoutDashboard, Receipt, User, LogOut, BarChart3, Users } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { workers, currentWorkerId, setCurrentWorkerId } = useExpenses();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="glass-card desktop-only" style={{ 
        width: '280px', 
        margin: 'var(--space-md)', 
        padding: 'var(--space-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-xl)',
        height: 'calc(100vh - 2 * var(--space-md))'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <div className="premium-gradient" style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart3 size={24} color="white" />
          </div>
          <span style={{ fontWeight: '700', fontSize: '1.25rem' }}>PickWell</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                padding: '0.75rem var(--space-md)',
                borderRadius: '0.75rem',
                color: activeTab === item.id ? 'white' : 'var(--text-secondary)',
                background: activeTab === item.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                textAlign: 'left',
                width: '100%'
              }}
            >
              <item.icon size={20} />
              <span style={{ fontWeight: '500' }}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{ padding: 'var(--space-sm) 0', borderTop: '1px solid var(--glass-border)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Switch Worker
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              {workers.map(worker => (
                <button
                  key={worker.id}
                  onClick={() => setCurrentWorkerId(worker.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    color: currentWorkerId === worker.id ? 'white' : 'var(--text-secondary)',
                    background: currentWorkerId === worker.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                    width: '100%'
                  }}
                >
                  <User size={16} />
                  <span style={{ fontSize: '0.875rem' }}>{worker.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
            padding: '0.75rem var(--space-md)',
            color: 'var(--error)',
            opacity: 0.8
          }}>
            <LogOut size={20} />
            <span style={{ fontWeight: '500' }}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-only glass-card" style={{
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        right: '1rem',
        height: '64px',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 1rem'
      }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: activeTab === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
            }}
          >
            <item.icon size={24} />
            <span style={{ fontSize: '0.625rem', fontWeight: '600' }}>{item.label}</span>
          </button>
        ))}
        
        <button
          onClick={() => setCurrentWorkerId(currentWorkerId === 1 ? 2 : 1)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--text-secondary)',
          }}
        >
          <Users size={24} />
          <span style={{ fontSize: '0.625rem', fontWeight: '600' }}>Switch</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
