import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Search, Trash2, FileSpreadsheet, FileText, CheckCircle, Clock, MoreVertical } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

const ExpenseList = () => {
  const { expenses, deleteExpense, updateExpense, workers } = useExpenses();
  const [filter, setFilter] = useState({ 
    search: '', 
    type: 'all', 
    workerId: 'all',
    period: 'all',
    customStart: '',
    customEnd: ''
  });

  const getFilteredExpenses = () => {
    return expenses.filter(e => {
      const matchesSearch = e.description.toLowerCase().includes(filter.search.toLowerCase()) || 
                            e.category.toLowerCase().includes(filter.search.toLowerCase());
      const matchesType = filter.type === 'all' || e.type === filter.type;
      const matchesWorker = filter.workerId === 'all' || e.worker_id === parseInt(filter.workerId);
      
      let matchesPeriod = true;
      const expenseDate = parseISO(e.date);
      const now = new Date();

      if (filter.period === 'last30') {
        matchesPeriod = isWithinInterval(expenseDate, { start: subDays(now, 30), end: now });
      } else if (filter.period === 'lastMonth') {
        const lastMonth = subDays(startOfMonth(now), 1);
        matchesPeriod = isWithinInterval(expenseDate, { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) });
      } else if (filter.period === 'lastYear') {
        matchesPeriod = isWithinInterval(expenseDate, { start: subDays(now, 365), end: now });
      } else if (filter.period === 'custom' && filter.customStart && filter.customEnd) {
        matchesPeriod = isWithinInterval(expenseDate, { 
          start: parseISO(filter.customStart), 
          end: parseISO(filter.customEnd) 
        });
      }

      return matchesSearch && matchesType && matchesWorker && matchesPeriod;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filteredExpenses = getFilteredExpenses();

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Type', 'Worker', 'Reimbursed', 'Status'];
    const rows = filteredExpenses.map(e => [
      e.date,
      e.description,
      e.amount,
      e.category,
      e.type,
      workers.find(w => w.id === e.worker_id)?.name || 'Unknown',
      e.type === 'legitimate_self' ? (e.reimbursed ? 'YES' : 'NO') : 'N/A',
      e.status
    ]);

    const csvContent = "\uFEFF" + [headers, ...rows].map(r => r.join(";")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Despesas_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {/* Filters Bar */}
      <div className="glass-card" style={{ padding: 'var(--space-md)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', alignItems: 'center' }}>
        <div style={{ flex: '1 1 100%', position: 'relative', marginBottom: '4px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" placeholder="Search..."
            value={filter.search}
            onChange={e => setFilter({...filter, search: e.target.value})}
            style={{ width: '100%', padding: '0.625rem 0.625rem 0.625rem 2.25rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '0.625rem', color: 'white', fontSize: '0.875rem' }}
          />
        </div>

        <select 
          value={filter.period}
          onChange={e => setFilter({...filter, period: e.target.value})}
          style={{ flex: 1, padding: '0.625rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '0.625rem', color: 'white', fontSize: '0.8125rem' }}
        >
          <option value="all">All Time</option>
          <option value="last30">Last 30 Days</option>
          <option value="lastMonth">Last Month</option>
        </select>

        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
          <button onClick={exportToCSV} className="glass-card" style={{ padding: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.8125rem' }}>
            <FileSpreadsheet size={16} /> Excel
          </button>
        </div>
      </div>

      {/* Desktop List */}
      <div className="glass-card desktop-only" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Info</th>
              <th style={{ padding: '1rem' }}>Worker</th>
              <th style={{ padding: '1rem' }}>Amount</th>
              <th style={{ padding: '1rem' }}>Approval</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '1rem', fontSize: '0.8125rem' }}>{e.date}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{e.description}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.category}</div>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.8125rem' }}>{workers.find(w => w.id === e.worker_id)?.name}</td>
                <td style={{ padding: '1rem', fontWeight: '800' }}>€{e.amount.toFixed(2)}</td>
                <td style={{ padding: '1rem' }}>
                  <button 
                    onClick={() => updateExpense({ ...e, status: e.status === 'approved' ? 'pending' : 'approved' })}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.5rem', 
                      color: e.status === 'approved' ? 'var(--info)' : 'var(--warning)',
                      fontSize: '0.625rem', fontWeight: '800', background: 'rgba(255,255,255,0.03)',
                      padding: '4px 8px', borderRadius: '4px', border: 'none'
                    }}
                  >
                    {e.status.toUpperCase()}
                  </button>
                </td>
                <td style={{ padding: '1rem' }}>
                  {e.type === 'legitimate_self' ? (
                    <button 
                      onClick={() => updateExpense({ ...e, reimbursed: !e.reimbursed })}
                      style={{ 
                        fontSize: '0.625rem', fontWeight: '800', padding: '4px 8px', borderRadius: '4px',
                        background: e.reimbursed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        color: e.reimbursed ? 'var(--success)' : 'var(--text-muted)',
                        border: 'none'
                      }}
                    >
                      {e.reimbursed ? 'REIMBURSED' : 'PENDING'}
                    </button>
                  ) : <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>N/A</span>}
                </td>
                <td style={{ padding: '1rem' }}>
                  <button onClick={() => deleteExpense(e.id)} style={{ color: 'var(--text-muted)' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {filteredExpenses.map(e => (
          <div key={e.id} className="glass-card" style={{ padding: 'var(--space-md)', borderLeft: `4px solid ${e.status === 'approved' ? 'var(--success)' : 'var(--warning)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '700' }}>{e.date} • {workers.find(w => w.id === e.worker_id)?.name.toUpperCase()}</p>
                <h4 style={{ fontWeight: '700', fontSize: '0.9375rem' }}>{e.description}</h4>
              </div>
              <p style={{ fontWeight: '900', fontSize: '1rem' }}>€{e.amount.toFixed(2)}</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ fontSize: '0.625rem', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontWeight: '600' }}>{e.category.toUpperCase()}</span>
                <span style={{ 
                  fontSize: '0.625rem', padding: '2px 6px', borderRadius: '4px', fontWeight: '800',
                  background: e.status === 'approved' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: e.status === 'approved' ? 'var(--info)' : 'var(--warning)'
                }}>{e.status.toUpperCase()}</span>
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button 
                  onClick={() => updateExpense({ ...e, status: e.status === 'approved' ? 'pending' : 'approved' })}
                  style={{ color: 'var(--text-secondary)', background: 'none', border: 'none' }}
                ><CheckCircle size={18} /></button>
                <button onClick={() => deleteExpense(e.id)} style={{ color: 'var(--error)', background: 'none', border: 'none' }}><Trash2 size={18} /></button>
              </div>
            </div>

            {e.type === 'legitimate_self' && (
              <button 
                onClick={() => updateExpense({ ...e, reimbursed: !e.reimbursed })}
                style={{ 
                  width: '100%', marginTop: '12px', padding: '8px', borderRadius: '8px',
                  background: e.reimbursed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                  color: e.reimbursed ? 'var(--success)' : 'var(--text-secondary)',
                  border: 'none', fontSize: '0.6875rem', fontWeight: '800', letterSpacing: '0.025em'
                }}
              >
                {e.reimbursed ? '✓ REIMBURSED' : 'MARK AS REIMBURSED'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
