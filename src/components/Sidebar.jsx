import React from 'react';
import { LayoutDashboard, Receipt, User, BarChart3, Users, ArrowLeftRight, LogOut } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { workers, currentWorkerId, setCurrentWorkerId } = useExpenses();
  const { signOut, user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
  ];

  const currentWorker = workers.find(w => w.id === currentWorkerId);

  const handleSwitch = () => {
    // Correctly toggle between ID 1 and 2
    const nextId = currentWorkerId === 1 ? 2 : 1;
    setCurrentWorkerId(nextId);
  };

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
        borderRight: '1px solid var(--border-primary)',
        overflowY: 'auto'
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

          <div style={{ padding: '0 0.25rem' }}>
            <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.375rem', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </p>
            <button
              onClick={signOut}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1.5px solid var(--border-primary)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: '0.8125rem',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-only" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80px',
        zIndex: 1000,
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 1rem 1.5rem 1rem', // Extra bottom padding for home indicators
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
              transition: 'all 0.2s',
              flex: 1
            }}
          >
            <item.icon size={22} style={{ color: activeTab === item.id ? 'var(--accent-primary)' : 'inherit' }} />
            <span style={{ fontSize: '0.6875rem', fontWeight: '700' }}>{item.label}</span>
          </button>
        ))}
        
        <button
          onClick={handleSwitch}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            border: 'none',
            background: 'none',
            color: 'var(--text-primary)',
            flex: 1,
            position: 'relative'
          }}
        >
          <div style={{ 
            background: 'var(--bg-secondary)', 
            padding: '4px 8px', 
            borderRadius: '6px', 
            border: '1px solid var(--border-primary)',
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px' 
          }}>
            <ArrowLeftRight size={16} />
            <span style={{ fontSize: '0.625rem', fontWeight: '800' }}>
              {currentWorker?.name.split(' ')[0].toUpperCase()}
            </span>
          </div>
          <span style={{ fontSize: '0.625rem', fontWeight: '700', color: 'var(--text-muted)' }}>SWITCH</span>
        </button>

        <button
          onClick={signOut}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            border: 'none',
            background: 'none',
            color: 'var(--text-muted)',
            flex: 1,
          }}
        >
          <LogOut size={22} />
          <span style={{ fontSize: '0.6875rem', fontWeight: '700' }}>Sign out</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
