import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Wallet, CreditCard, PieChart, TrendingDown, Receipt } from 'lucide-react';

const StatCard = ({ title, amount, icon: Icon, color, subtitle }) => (
  <div className="glass-card" style={{ padding: 'var(--space-lg)', flex: 1, minWidth: '280px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
      <div style={{ 
        background: `${color}15`, 
        color: color, 
        padding: '0.75rem', 
        borderRadius: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={24} />
      </div>
    </div>
    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: '600', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{title}</h3>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
      <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>€{amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</span>
    </div>
    {subtitle && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-xs)', fontWeight: '500' }}>{subtitle}</p>}
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
          title="Self Paid (Pending)" 
          amount={stats.legitimateSelf} 
          icon={Wallet} 
          color="#10b981" 
        />
        <StatCard 
          title="Company Card" 
          amount={stats.legitimateCard} 
          icon={CreditCard} 
          color="#3b82f6" 
        />
        <StatCard 
          title="Monthly Budget" 
          amount={stats.falseExpenses} 
          icon={TrendingDown} 
          color="#f59e0b" 
          subtitle={`Limit: €${worker?.budget}`}
        />
      </section>

      {/* Main Grid */}
      <div className="dashboard-grid" style={{ display: 'flex', gap: 'var(--space-xl)' }}>
        {/* Recent Activity */}
        <div className="glass-card" style={{ padding: 'var(--space-lg)', flex: 2 }}>
          <h2 style={{ marginBottom: 'var(--space-lg)', fontSize: '1.125rem', fontWeight: '700' }}>Recent Activity</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {recentExpenses.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem', fontSize: '0.875rem' }}>No activity yet.</p>
            ) : (
              recentExpenses.map(expense => (
                <div key={expense.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.03)'
                }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ 
                      width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Receipt size={18} color="var(--text-secondary)" />
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>{expense.description}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{expense.category}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '700', fontSize: '0.875rem' }}>€{expense.amount.toFixed(2)}</p>
                    <div style={{ 
                      fontSize: '0.625rem', fontWeight: '800', 
                      color: expense.status === 'approved' ? 'var(--success)' : 'var(--warning)',
                      marginTop: '2px'
                    }}>
                      {expense.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Budget Status */}
        <div className="glass-card budget-status-card" style={{ padding: 'var(--space-lg)', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '700' }}>Budget Used</h2>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-lg)', padding: '1rem 0' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
              <svg width="120" height="120" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="42" fill="none" 
                  stroke="var(--accent-primary)" strokeWidth="8" 
                  strokeDasharray={`${budgetUsagePercent * 2.63} 263`}
                  transform="rotate(-90 50 50)"
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 1s ease-out' }}
                />
              </svg>
              <div style={{ 
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' 
              }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>{Math.round(budgetUsagePercent)}%</span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '500', marginBottom: '4px' }}>REMAINING</p>
              <p style={{ fontSize: '1.25rem', fontWeight: '800', color: stats.budgetRemaining < 50 ? 'var(--error)' : 'var(--success)' }}>
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
