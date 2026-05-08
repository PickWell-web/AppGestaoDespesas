import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Search, Trash2, FileSpreadsheet, CheckCircle, Clock, FileText, Calendar, Tag } from 'lucide-react';
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
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Type', 'Worker', 'Status'];
    const rows = filteredExpenses.map(e => [
      e.date, e.description, e.amount, e.category, e.type,
      workers.find(w => w.id === e.worker_id)?.name || 'Unknown', 
      e.status === 'approved' ? 'REIMBURSED' : 'PENDING'
    ]);

    const csvContent = "\uFEFF" + [headers, ...rows].map(r => r.join(";")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Despesas_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.click();
  };

  const handlePrint = () => window.print();

  const getTypeLabel = (type) => {
    return type.replace('_', ' ').replace('legitimate', '').replace('false', 'False:').toUpperCase();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {/* Search and Filter */}
      <div className="clean-card" style={{ padding: 'var(--space-md)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', alignItems: 'center' }}>
        <div style={{ flex: '1 1 200px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" placeholder="Search..."
            value={filter.search}
            onChange={e => setFilter({...filter, search: e.target.value})}
            style={{ width: '100%', padding: '0.625rem 0.625rem 0.625rem 2.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '0.5rem', color: 'var(--text-primary)', fontSize: '0.875rem' }}
          />
        </div>

        <select 
          value={filter.workerId}
          onChange={e => setFilter({...filter, workerId: e.target.value})}
          style={{ padding: '0.625rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '0.5rem', color: 'var(--text-primary)', fontSize: '0.8125rem' }}
        >
          <option value="all">All Employees</option>
          {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>

        <select 
          value={filter.period}
          onChange={e => setFilter({...filter, period: e.target.value})}
          style={{ padding: '0.625rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '0.5rem', color: 'var(--text-primary)', fontSize: '0.8125rem' }}
        >
          <option value="all">All Time</option>
          <option value="last30">Last 30 Days</option>
          <option value="lastMonth">Last Month</option>
          <option value="custom">Custom Range</option>
        </select>

        {filter.period === 'custom' && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input 
              type="date" value={filter.customStart}
              onChange={e => setFilter({...filter, customStart: e.target.value})}
              style={{ padding: '0.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '0.5rem', color: 'var(--text-primary)', fontSize: '0.8125rem' }}
            />
            <span style={{ color: 'var(--text-muted)' }}>to</span>
            <input 
              type="date" value={filter.customEnd}
              onChange={e => setFilter({...filter, customEnd: e.target.value})}
              style={{ padding: '0.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '0.5rem', color: 'var(--text-primary)', fontSize: '0.8125rem' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
          <button onClick={exportToCSV} className="secondary-button" style={{ padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button onClick={handlePrint} className="secondary-button" style={{ padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
            <FileText size={16} /> PDF
          </button>
        </div>
      </div>

      {/* Desktop List */}
      <div className="clean-card desktop-only" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-primary)', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Expense Info</th>
              <th style={{ padding: '1rem' }}>Type</th>
              <th style={{ padding: '1rem' }}>Worker</th>
              <th style={{ padding: '1rem' }}>Amount</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <td style={{ padding: '1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{e.date}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-primary)' }}>{e.description}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.category}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: '800', color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
                    {getTypeLabel(e.type)}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{workers.find(w => w.id === e.worker_id)?.name}</td>
                <td style={{ padding: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>€{e.amount.toFixed(2)}</td>
                <td style={{ padding: '1rem' }}>
                  <button 
                    onClick={() => updateExpense({ ...e, status: e.status === 'approved' ? 'pending' : 'approved' })}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.4rem', 
                      color: e.status === 'approved' ? 'var(--success)' : 'var(--warning)',
                      fontSize: '0.6875rem', fontWeight: '800', background: 'none', border: 'none', cursor: 'pointer'
                    }}
                  >
                    {e.status === 'approved' ? <CheckCircle size={14} /> : <Clock size={14} />}
                    {e.status === 'approved' ? 'REIMBURSED' : 'PENDING'}
                  </button>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button onClick={() => deleteExpense(e.id)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile List */}
      <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {filteredExpenses.map(e => (
          <div key={e.id} className="clean-card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '2px' }}>{getTypeLabel(e.type)}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{e.date} • {workers.find(w => w.id === e.worker_id)?.name.split(' ')[0]}</p>
                <h4 style={{ fontWeight: '700', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{e.description}</h4>
              </div>
              <p style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>€{e.amount.toFixed(2)}</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-primary)' }}>
              <span style={{ 
                fontSize: '0.6875rem', fontWeight: '800', 
                color: e.status === 'approved' ? 'var(--success)' : 'var(--warning)'
              }}>
                {e.status === 'approved' ? 'REIMBURSED' : 'PENDING'}
              </span>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => updateExpense({ ...e, status: e.status === 'approved' ? 'pending' : 'approved' })}
                  style={{ color: 'var(--text-secondary)', background: 'none', border: 'none' }}
                ><CheckCircle size={18} /></button>
                <button onClick={() => deleteExpense(e.id)} style={{ color: 'var(--error)', background: 'none', border: 'none' }}><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
