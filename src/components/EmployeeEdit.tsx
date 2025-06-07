import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../lib/api';

const fields = [
  { key: 'name', label: 'Name' },
  { key: 'surname', label: 'Surname' },
  { key: 'id_number', label: 'ID Number' },
  { key: 'birth_date', label: 'Birth Date' },
  { key: 'sex', label: 'Sex' },
  { key: 'nationality', label: 'Nationality' },
  { key: 'personal_number', label: 'Personal Number' },
];

export default function EmployeeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`${API_BASE_URL}/employees/list`)
      .then(res => {
        const emp = res.data.find((e: any) => String(e.id) === String(id));
        if (emp) setForm(emp);
        else setToast({ message: 'Employee not found', type: 'error' });
      })
      .catch(() => setToast({ message: 'Failed to fetch employee', type: 'error' }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(`${API_BASE_URL}/employees/edit/${id}`, form);
      setToast({ message: 'Employee updated!', type: 'success' });
      setTimeout(() => navigate('/employees'), 1200);
    } catch (err: any) {
      setToast({ message: err?.response?.data?.detail || 'Edit failed', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <div className="w-full max-w-xl bg-white/80 rounded-3xl shadow-2xl border border-blue-100 p-8">
        <h2 className="text-2xl font-extrabold text-blue-900 mb-6 text-center">Edit Employee</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {fields.map(field => (
            <div key={field.key} className="flex flex-col gap-1">
              <label className="text-blue-700 font-semibold mb-1" htmlFor={field.key}>{field.label}</label>
              <input
                id={field.key}
                name={field.key}
                value={form[field.key] || ''}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl border border-blue-200 bg-white/90 text-blue-900 shadow text-base font-medium focus:ring-2 focus:ring-cyan-400"
                disabled={loading}
                autoComplete="off"
              />
            </div>
          ))}
          <div className="flex gap-4 justify-center mt-4">
            <button type="submit" className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform text-lg" disabled={loading}>Save</button>
            <button type="button" onClick={() => navigate('/employees')} className="px-8 py-3 rounded-2xl bg-blue-50 text-blue-500 font-bold shadow hover:bg-blue-100 transition text-lg" disabled={loading}>Cancel</button>
          </div>
        </form>
        {toast && (
          <div className={`mt-6 px-6 py-3 rounded-xl shadow-lg font-semibold text-white text-center text-base ${toast.type === 'success' ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : 'bg-red-500'} animate-fade-in`} style={{ boxShadow: '0 4px 24px 0 rgba(56,189,248,0.10)' }}>{toast.message}</div>
        )}
      </div>
    </div>
  );
} 