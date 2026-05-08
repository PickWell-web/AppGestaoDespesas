import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Wallet, CreditCard, TrendingDown, Receipt } from 'lucide-react';

const StatCard = ({ title, amount, icon: Icon, color }) => (
  <div className="clean-card" style={{ padding: 'var(--space-lg)', flex: 1, minWidth: '260px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
      <div style={{ 
        background: 'var(--bg-secondary)', 
        color: 'var(--text-primary)', 
        padding: '0.5rem', 
        borderRadius: '8px',
        border: '1px solid var(--border-primary)'
      }}>
        <Icon size={18} />
      </div>
      <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>{title}</h3>
    </div>
    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
      €{amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
    </div>
  </div>
);

const Dashboard = () => {
  const { currentWorkerId, workers, getWorkerStats, expenses } = useExpenses();
  const worker = workers.find(w => w.id === currentWorkerId);
  const stats = getWorkerStats(currentWorkerId);

  const budgetUsagePercent = Math.min((stats.falseExpenses / (worker?.budget || 1)) * 100, 100);

  const recentExpenses = expenses
    .filter(e => e.worker_id === currentWorkerId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      {/* Stats Section */}
      <section style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-lg)' }}>
        <StatCard 
          title="Personal (Reimbursable)" 
          amount={stats.legitimateSelf} 
          icon={Wallet} 
          color="var(--success)" 
        />
        <StatCard 
          title="Company Card" 
          amount={stats.legitimateCard} 
          icon={CreditCard} 
          color="var(--info)" 
        />
        <StatCard 
          title="Monthly Budget Used" 
          amount={stats.falseExpenses} 
          icon={TrendingDown} 
          color="var(--warning)" 
        />
      </section>

      {/* Main Grid */}
      <div className="dashboard-grid" style={{ display: 'flex', gap: 'var(--space-lg)' }}>
        {/* Recent Activity */}
        <div className="clean-card" style={{ padding: 'var(--space-lg)', flex: 2 }}>
          <h2 style={{ marginBottom: '1.25rem', fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Recent Activity</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recentExpenses.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem', fontSize: '0.875rem' }}>No recent activity.</p>
            ) : (
              recentExpenses.map(expense => (
                <div key={expense.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.875rem',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '0.75rem',
                  background: 'var(--bg-secondary)'
                }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                      <Receipt size={18} />
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-primary)' }}>{expense.description}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{expense.category} • {expense.date}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-primary)' }}>€{expense.amount.toFixed(2)}</p>
                    <span style={{ 
                      fontSize: '0.625rem', fontWeight: '800', 
                      color: expense.status === 'approved' ? 'var(--success)' : 'var(--warning)'
                    }}>
                      {expense.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Budget Status */}
        <div className="clean-card" style={{ padding: 'var(--space-lg)', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Budget Overview</h2>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative', width: '110px', height: '110px' }}>
              <svg width="110" height="110" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="var(--border-primary)" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="44" fill="none" 
                  stroke="var(--accent-primary)" strokeWidth="8" 
                  strokeDasharray={`${budgetUsagePercent * 2.76} 276`}
                  transform="rotate(-90 50 50)"
                  strokeLinecap="round"
                />
              </svg>
              <div style={{ 
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', fontWeight: '800'
              }}>
                {Math.round(budgetUsagePercent)}%
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: '500', marginBottom: '4px' }}>REMAINING</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '800', color: stats.budgetRemaining < 50 ? 'var(--error)' : 'var(--success)', letterSpacing: '-0.025em' }}>
                €{stats.budgetRemaining.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
