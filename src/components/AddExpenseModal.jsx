import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { X, Camera, Save, QrCode } from 'lucide-react';

const AddExpenseModal = ({ onClose }) => {
  const { addExpense, currentWorkerId, workers } = useExpenses();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Food',
    type: 'legitimate_self',
    workerId: currentWorkerId,
    invoiceNumber: '',
    taxId: ''
  });

  const categories = ['Food', 'Transport', 'Utilities', 'Software', 'Hardware', 'Office', 'Other'];
  const types = [
    { id: 'legitimate_self', label: 'Legitimate (Self Paid)' },
    { id: 'legitimate_card', label: 'Legitimate (Company Card)' },
    { id: 'false_self', label: 'False Expense (Self Paid)' },
    { id: 'false_card', label: 'False Expense (Company Card)' }
  ];

  const parsePortugueseQR = (qrString) => {
    // Basic ATUD parser for Portuguese invoices
    // Format: A:513151325*B:513151325*...*I1:100.00*
    const fields = qrString.split('*');
    const data = {};
    fields.forEach(field => {
      const [key, value] = field.split(':');
      if (key && value) data[key] = value;
    });

    return {
      taxId: data['A'] || '', // Issuer NIF
      amount: data['I1'] ? parseFloat(data['I1']) : 0, // Total Amount
      date: data['F'] ? `${data['F'].slice(0, 4)}-${data['F'].slice(4, 6)}-${data['F'].slice(6, 8)}` : '',
      invoiceNumber: data['G'] || ''
    };
  };

  const handleQRScan = () => {
    // In a real app, this would open a camera. 
    // For this demo, we'll prompt for the QR string or use a mock.
    const mockQR = "A:513151325*B:999999999*C:PT*D:FT*E:N*F:20240508*G:FT 2024/123*H:0*I1:45.50*I3:0.00*I4:0.00*I5:8.51*I7:36.99*I8:8.51*";
    const result = parsePortugueseQR(mockQR);
    
    setFormData(prev => ({
      ...prev,
      amount: result.amount,
      date: result.date || prev.date,
      taxId: result.taxId,
      invoiceNumber: result.invoiceNumber,
      description: `Invoice ${result.invoiceNumber}`
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;
    
    setLoading(true);
    setTimeout(() => {
      addExpense({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      padding: 'var(--space-md)'
    }}>
      <div className="glass-card" style={{ 
        width: '100%', maxWidth: '500px', padding: 'var(--space-xl)',
        display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Add New Expense</h2>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X /></button>
        </div>

        <button 
          onClick={handleQRScan}
          style={{
            width: '100%', padding: 'var(--space-md)', borderRadius: '0.75rem',
            background: 'rgba(255, 255, 255, 0.05)', border: '1px dashed var(--glass-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            color: 'var(--accent-primary)', fontWeight: '600'
          }}
        >
          <QrCode size={20} /> Scan Portuguese QR Code (Simulated)
        </button>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Amount (€)</label>
              <input 
                type="number" step="0.01" required
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.5rem', color: 'white' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Date</label>
              <input 
                type="date" required
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.5rem', color: 'white' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Description</label>
            <input 
              type="text" required placeholder="e.g. Lunch with Client"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.5rem', color: 'white' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.5rem', color: 'white' }}
              >
                {categories.map(c => <option key={c} value={c} style={{ background: '#1a1a1a', color: 'white' }}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Worker</label>
              <select 
                value={formData.workerId}
                onChange={e => setFormData({...formData, workerId: parseInt(e.target.value)})}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.5rem', color: 'white' }}
              >
                {workers.map(w => <option key={w.id} value={w.id} style={{ background: '#1a1a1a', color: 'white' }}>{w.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Expense Type</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {types.map(t => (
                <button
                  type="button" key={t.id}
                  onClick={() => setFormData({...formData, type: t.id})}
                  style={{
                    padding: '0.75rem', borderRadius: '0.5rem', textAlign: 'left',
                    background: formData.type === t.id ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-card)',
                    border: `1px solid ${formData.type === t.id ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                    color: formData.type === t.id ? 'white' : 'var(--text-secondary)'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            disabled={loading}
            className="premium-gradient"
            style={{ 
              marginTop: 'var(--space-md)', padding: '1rem', borderRadius: '0.75rem', 
              color: 'white', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' 
            }}
          >
            {loading ? 'Saving...' : <><Save size={20} /> Save Expense</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
