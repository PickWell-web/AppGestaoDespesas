import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Search, Download, Trash2, Filter, FileSpreadsheet, FileText, Calendar, CheckCircle2, Circle } from 'lucide-react';
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
      const matchesWorker = filter.workerId === 'all' || e.workerId === parseInt(filter.workerId);
      
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
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Type', 'Worker', 'Invoice', 'Reimbursed'];
    const rows = filteredExpenses.map(e => [
      e.date,
      e.description,
      e.amount,
      e.category,
      e.type,
      workers.find(w => w.id === e.workerId)?.name || 'Unknown',
      e.invoiceNumber || 'N/A',
      e.type === 'legitimate_self' ? (e.reimbursed ? 'YES' : 'NO') : 'N/A'
    ]);

    const csvContent = "\uFEFF" + [headers, ...rows].map(r => r.join(";")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Despesas_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const getTypeColor = (type) => {
    if (type.includes('card')) return 'var(--info)';
    if (type.includes('self')) return 'var(--success)';
    return 'var(--warning)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div className="glass-card" style={{ padding: 'var(--space-lg)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', alignItems: 'center' }}>
        <div style={{ flex: '1 1 200px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" placeholder="Search expenses..."
            value={filter.search}
            onChange={e => setFilter({...filter, search: e.target.value})}
            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white' }}
          />
        </div>

        <select 
          value={filter.type}
          onChange={e => setFilter({...filter, type: e.target.value})}
          style={{ padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white' }}
        >
          <option value="all" style={{ background: '#1a1a1a' }}>All Types</option>
          <option value="legitimate_self" style={{ background: '#1a1a1a' }}>Legit - Self Paid</option>
          <option value="legitimate_card" style={{ background: '#1a1a1a' }}>Legit - Company Card</option>
          <option value="false_self" style={{ background: '#1a1a1a' }}>False - Self Paid</option>
          <option value="false_card" style={{ background: '#1a1a1a' }}>False - Company Card</option>
        </select>

        <select 
          value={filter.workerId}
          onChange={e => setFilter({...filter, workerId: e.target.value})}
          style={{ padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white' }}
        >
          <option value="all" style={{ background: '#1a1a1a' }}>All Workers</option>
          {workers.map(w => <option key={w.id} value={w.id} style={{ background: '#1a1a1a' }}>{w.name}</option>)}
        </select>

        <select 
          value={filter.period}
          onChange={e => setFilter({...filter, period: e.target.value})}
          style={{ padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white' }}
        >
          <option value="all" style={{ background: '#1a1a1a' }}>All Time</option>
          <option value="last30" style={{ background: '#1a1a1a' }}>Last 30 Days</option>
          <option value="lastMonth" style={{ background: '#1a1a1a' }}>Last Month</option>
          <option value="lastYear" style={{ background: '#1a1a1a' }}>Last Year</option>
          <option value="custom" style={{ background: '#1a1a1a' }}>Custom Range</option>
        </select>

        {filter.period === 'custom' && (
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            <input 
              type="date" value={filter.customStart}
              onChange={e => setFilter({...filter, customStart: e.target.value})}
              style={{ padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white' }}
            />
            <span style={{ color: 'var(--text-muted)' }}>to</span>
            <input 
              type="date" value={filter.customEnd}
              onChange={e => setFilter({...filter, customEnd: e.target.value})}
              style={{ padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button onClick={exportToCSV} className="glass-card" style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
            <FileSpreadsheet size={20} /> Excel
          </button>
          <button onClick={handlePrint} className="glass-card" style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--info)' }}>
            <FileText size={20} /> PDF
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="glass-card desktop-only" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <th style={{ padding: 'var(--space-lg)' }}>Date</th>
              <th style={{ padding: 'var(--space-lg)' }}>Description</th>
              <th style={{ padding: 'var(--space-lg)' }}>Worker</th>
              <th style={{ padding: 'var(--space-lg)' }}>Type</th>
              <th style={{ padding: 'var(--space-lg)' }}>Amount</th>
              <th style={{ padding: 'var(--space-lg)' }}>Reimbursed?</th>
              <th style={{ padding: 'var(--space-lg)' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>No expenses found matching your criteria.</td>
              </tr>
            ) : (
              filteredExpenses.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }} className="table-row-hover">
                  <td style={{ padding: 'var(--space-lg)', fontSize: '0.875rem' }}>{e.date}</td>
                  <td style={{ padding: 'var(--space-lg)' }}>
                    <div style={{ fontWeight: '600' }}>{e.description}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.category} • {e.invoiceNumber || 'Manual entry'}</div>
                  </td>
                  <td style={{ padding: 'var(--space-lg)', fontSize: '0.875rem' }}>{workers.find(w => w.id === e.workerId)?.name}</td>
                  <td style={{ padding: 'var(--space-lg)' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: getTypeColor(e.type)
                    }}>
                      {e.type.replace('_', ' ').replace('legitimate ', '').replace('false ', 'False: ')}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-lg)', fontWeight: '700' }}>€{e.amount.toFixed(2)}</td>
                  <td style={{ padding: 'var(--space-lg)' }}>
                    {e.type === 'legitimate_self' ? (
                      <button 
                        onClick={() => updateExpense({ ...e, reimbursed: !e.reimbursed })}
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '0.5rem', 
                          color: e.reimbursed ? 'var(--success)' : 'var(--text-muted)',
                          padding: '0.5rem', borderRadius: '0.5rem',
                          background: e.reimbursed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${e.reimbursed ? 'var(--success)' : 'var(--glass-border)'}`,
                          fontWeight: '600', fontSize: '0.75rem'
                        }}
                      >
                        {e.reimbursed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                        {e.reimbursed ? 'REIMBURSED' : 'PENDING'}
                      </button>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>N/A</span>
                    )}
                  </td>
                  <td style={{ padding: 'var(--space-lg)' }}>
                    <button onClick={() => deleteExpense(e.id)} style={{ color: 'var(--text-muted)', padding: '0.5rem' }} className="delete-btn">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {filteredExpenses.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No expenses found.</p>
        ) : (
          filteredExpenses.map(e => (
            <div key={e.id} className="glass-card" style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.date}</p>
                  <p style={{ fontWeight: '700', fontSize: '1rem' }}>{e.description}</p>
                </div>
                <p style={{ fontWeight: '800', fontSize: '1.125rem' }}>€{e.amount.toFixed(2)}</p>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.625rem', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>{e.category}</span>
                <span style={{ fontSize: '0.625rem', color: getTypeColor(e.type), fontWeight: '600' }}>
                  {e.type.replace('_', ' ').replace('legitimate ', '').toUpperCase()}
                </span>
                <span style={{ fontSize: '0.625rem', color: 'var(--text-secondary)' }}>• {workers.find(w => w.id === e.workerId)?.name}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', paddingTop: '8px', borderTop: '1px solid var(--glass-border)' }}>
                {e.type === 'legitimate_self' ? (
                  <button 
                    onClick={() => updateExpense({ ...e, reimbursed: !e.reimbursed })}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.5rem', 
                      color: e.reimbursed ? 'var(--success)' : 'var(--text-muted)',
                      fontSize: '0.75rem', fontWeight: '700'
                    }}
                  >
                    {e.reimbursed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    {e.reimbursed ? 'REIMBURSED' : 'MARK AS PAID'}
                  </button>
                ) : <div />}
                
                <button onClick={() => deleteExpense(e.id)} style={{ color: 'var(--error)', padding: '4px' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .table-row-hover:hover { background: rgba(255,255,255,0.02); }
        .delete-btn:hover { color: var(--error) !important; }
        @media print {
          aside, header, .glass-card:first-child, .delete-btn { display: none !important; }
          body { background: white !important; color: black !important; }
          .glass-card { background: none !important; border: 1px solid #eee !important; box-shadow: none !important; }
          table th, table td { color: black !important; border-bottom: 1px solid #eee !important; }
        }
      `}</style>
    </div>
  );
};

export default ExpenseList;
