import React from 'react';
import { LayoutDashboard, Receipt, User, BarChart3, Users } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { workers, currentWorkerId, setCurrentWorkerId } = useExpenses();

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="desktop-only" style={{ 
        width: '260px', 
        padding: 'var(--space-xl) var(--space-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
        height: '100vh',
        position: 'sticky',
        top: 0,
        background: 'var(--bg-primary)',
        borderRight: '1px solid var(--border-primary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '0 0.5rem' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '8px',
            background: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart3 size={18} color="var(--bg-primary)" />
          </div>
          <span style={{ fontWeight: '800', fontSize: '1.125rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>PickWell</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.75rem',
                borderRadius: '0.5rem',
                color: activeTab === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: activeTab === item.id ? 'var(--bg-hover)' : 'transparent',
                border: 'none',
                fontWeight: activeTab === item.id ? '600' : '500',
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.2s'
              }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{ padding: 'var(--space-md)', background: 'var(--bg-secondary)', borderRadius: '0.75rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)', fontWeight: '700', textTransform: 'uppercase' }}>
              Worker
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {workers.map(worker => (
                <button
                  key={worker.id}
                  onClick={() => setCurrentWorkerId(worker.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    padding: '0.5rem',
                    borderRadius: '0.4rem',
                    border: 'none',
                    color: currentWorkerId === worker.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: currentWorkerId === worker.id ? 'var(--bg-primary)' : 'transparent',
                    boxShadow: currentWorkerId === worker.id ? 'var(--shadow-sm)' : 'none',
                    width: '100%',
                    cursor: 'pointer',
                    fontSize: '0.8125rem',
                    fontWeight: '600'
                  }}
                >
                  <User size={14} />
                  <span>{worker.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-only" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '72px',
        zIndex: 100,
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 1rem',
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
              border: 'none',
              background: 'none',
              color: activeTab === item.id ? 'var(--text-primary)' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            <item.icon size={22} />
            <span style={{ fontSize: '0.6875rem', fontWeight: '700' }}>{item.label}</span>
          </button>
        ))}
        
        <button
          onClick={() => setCurrentWorkerId(currentWorkerId === 1 ? 2 : 1)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            border: 'none',
            background: 'none',
            color: 'var(--text-muted)',
          }}
        >
          <Users size={22} />
          <span style={{ fontSize: '0.6875rem', fontWeight: '700' }}>SWITCH</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
