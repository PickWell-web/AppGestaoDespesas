import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { X, Save, Paperclip } from 'lucide-react';

const AddExpenseModal = ({ onClose }) => {
  const { addExpense, currentWorkerId, workers } = useExpenses();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Food',
    type: 'legitimate_self',
    worker_id: currentWorkerId
  });

  const categories = ['Food', 'Transport', 'Utilities', 'Software', 'Hardware', 'Office', 'Other'];
  const types = [
    { id: 'legitimate_self', label: 'Legit - Self Paid' },
    { id: 'legitimate_card', label: 'Legit - Company Card' },
    { id: 'false_self', label: 'False - Self Paid' },
    { id: 'false_card', label: 'False - Company Card' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;
    
    setLoading(true);
    try {
      const { error } = await addExpense({
        ...formData,
        amount: parseFloat(formData.amount)
      }, file);
      
      if (error) {
        alert('Error: ' + error.message);
      } else {
        onClose();
      }
    } catch (err) {
      alert('Error uploading file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      padding: 'var(--space-md)'
    }}>
      <div className="clean-card" style={{ 
        width: '100%', maxWidth: '440px', padding: 'var(--space-xl)',
        display: 'flex', flexDirection: 'column', gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>New Expense</h2>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Amount (€)</label>
              <input 
                type="number" step="0.01" required
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Date</label>
              <input 
                type="date" required
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Description</label>
            <input 
              type="text" required placeholder="Lunch, software subscription, etc."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--text-primary)', outline: 'none' }}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Worker</label>
              <select 
                value={formData.worker_id}
                onChange={e => setFormData({...formData, worker_id: parseInt(e.target.value)})}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--text-primary)', outline: 'none' }}
              >
                {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Invoice Attachment</label>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.75rem', borderRadius: '0.5rem',
              background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
              position: 'relative'
            }}>
              <Paperclip size={18} style={{ color: file ? 'var(--success)' : 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.8125rem', color: file ? 'var(--text-primary)' : 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file ? file.name : 'Take photo or select from gallery'}
              </span>
              <input 
                type="file" 
                accept=".jpg, .jpeg, .png, .pdf, image/*, application/pdf"
                onChange={e => setFile(e.target.files[0])}
                style={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                  opacity: 0, cursor: 'pointer' 
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {types.map(t => (
                <button
                  type="button" key={t.id}
                  onClick={() => setFormData({...formData, type: t.id})}
                  style={{
                    padding: '0.625rem', borderRadius: '0.5rem', textAlign: 'center',
                    background: formData.type === t.id ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    border: `1px solid ${formData.type === t.id ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                    color: formData.type === t.id ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    fontSize: '0.6875rem', fontWeight: '700', cursor: 'pointer'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            disabled={loading}
            className="primary-button"
            style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
          >
            {loading ? 'Saving...' : <><Save size={18} /> Save Expense</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
