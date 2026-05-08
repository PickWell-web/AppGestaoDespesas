import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Wallet, CreditCard, PieChart, TrendingDown, Receipt } from 'lucide-react';

const StatCard = ({ title, amount, icon: Icon, color, subtitle }) => (
  <div className="glass-card" style={{ padding: 'var(--space-lg)', flex: 1, minWidth: '240px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
      <div style={{ 
        background: `${color}20`, 
        color: color, 
        padding: 'var(--space-sm)', 
        borderRadius: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={24} />
      </div>
    </div>
    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500', marginBottom: 'var(--space-xs)' }}>{title}</h3>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
      <span style={{ fontSize: '1.75rem', fontWeight: '700' }}>€{amount.toFixed(2)}</span>
    </div>
    {subtitle && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-xs)' }}>{subtitle}</p>}
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
      <section style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-lg)' }}>
        <StatCard 
          title="Self Paid (Reimbursable)" 
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
          title="False Expenses (Budget)" 
          amount={stats.falseExpenses} 
          icon={TrendingDown} 
          color="#f59e0b" 
          subtitle={`Budget: €${worker?.budget}`}
        />
      </section>

      <div className="dashboard-grid" style={{ display: 'flex', gap: 'var(--space-xl)' }}>
        <div className="glass-card" style={{ padding: 'var(--space-xl)', flex: 2 }}>
          <h2 style={{ marginBottom: 'var(--space-lg)', fontSize: '1.25rem' }}>Recent Expenses</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {recentExpenses.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No expenses recorded yet.</p>
            ) : (
              recentExpenses.map(expense => (
                <div key={expense.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: 'var(--space-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '0.75rem'
                }}>
                  <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'var(--bg-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Receipt size={20} color="var(--text-secondary)" />
                    </div>
                    <div>
                      <p style={{ fontWeight: '600' }}>{expense.description}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{expense.date} • {expense.category}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '700' }}>€{expense.amount.toFixed(2)}</p>
                    <p style={{ fontSize: '0.625rem', color: expense.status === 'approved' ? 'var(--success)' : 'var(--warning)' }}>
                      {expense.status.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-card budget-status-card" style={{ padding: 'var(--space-xl)', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Budget Status</h2>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div style={{ position: 'relative', width: '150px', height: '150px' }}>
              <svg width="150" height="150" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-card)" strokeWidth="10" />
                <circle 
                  cx="50" cy="50" r="45" fill="none" 
                  stroke="var(--accent-primary)" strokeWidth="10" 
                  strokeDasharray={`${budgetUsagePercent * 2.83} 283`}
                  transform="rotate(-90 50 50)"
                  strokeLinecap="round"
                />
              </svg>
              <div style={{ 
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' 
              }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>{Math.round(budgetUsagePercent)}%</span>
                <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>USED</span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Remaining Budget</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', color: stats.budgetRemaining < 50 ? 'var(--error)' : 'var(--success)' }}>
                €{stats.budgetRemaining.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
