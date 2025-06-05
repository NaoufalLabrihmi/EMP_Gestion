import React, { useState, useEffect } from 'react';
import { BellIcon, UserCircleIcon } from './icons';
import axios from 'axios';
import { API_BASE_URL } from '../lib/api';
import { FaCheck, FaEdit, FaDownload } from 'react-icons/fa';
import { pdf } from '@react-pdf/renderer';
import EmployeePDF from './EmployeePDF';

const statusMap = {
  Active: { color: 'bg-blue-100 text-blue-700', icon: <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1" /> },
  'On Leave': { color: 'bg-cyan-100 text-cyan-700', icon: <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full mr-1" /> },
  Inactive: { color: 'bg-blue-50 text-blue-400', icon: <span className="inline-block w-2 h-2 bg-blue-300 rounded-full mr-1" /> },
};

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; employee?: any }>({ open: false, mode: 'add' });
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id?: number }>({ open: false });
  const [form, setForm] = useState({ name: '', email: '', role: '', status: 'Active' });
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const openAdd = () => {
    setForm({ name: '', email: '', role: '', status: 'Active' });
    setFile(null);
    setModal({ open: true, mode: 'add' });
  };
  const openEdit = (emp: any) => {
    setForm(emp);
    setModal({ open: true, mode: 'edit', employee: emp });
  };
  const closeModal = () => setModal({ open: false, mode: 'add' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (modal.mode === 'add') {
      if (!file) {
        setToast({ message: 'Please upload an ID card image.', type: 'error' });
        setLoading(false);
        return;
      }
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post(`${API_BASE_URL}/employees/add`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const emp = res.data.employee;
        setEmployees(emps => [
          ...emps,
          {
            id: Date.now(),
            name: emp.name + ' ' + emp.surname,
            email: '-',
            role: '-',
            status: 'Active',
            ...emp,
          },
        ]);
        setToast({ message: 'Employee added from scan!', type: 'success' });
        closeModal();
      } catch (err: any) {
        setToast({ message: err?.response?.data?.detail || 'Scan failed', type: 'error' });
      }
      setLoading(false);
      return;
    } else if (modal.mode === 'edit' && modal.employee) {
      setEmployees(emps => emps.map(emp => emp.id === modal.employee.id ? { ...form, id: emp.id } : emp));
      setToast({ message: 'Employee updated!', type: 'success' });
    }
    setLoading(false);
    closeModal();
  };
  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/employees/delete/${confirmDelete.id}`);
      setEmployees(emps => emps.filter(emp => emp.id !== confirmDelete.id));
      setToast({ message: 'Employee deleted!', type: 'success' });
    } catch (err: any) {
      setToast({ message: err?.response?.data?.detail || 'Delete failed', type: 'error' });
    }
    setLoading(false);
    setConfirmDelete({ open: false });
  };
  const startEdit = (emp: any) => {
    setEditingId(emp.id);
    setEditForm({ ...emp });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));
  };
  const saveEdit = async () => {
    setLoading(true);
    try {
      await axios.patch(`${API_BASE_URL}/employees/edit/${editingId}`, editForm);
      setEmployees(emps => emps.map(emp => emp.id === editingId ? { ...emp, ...editForm } : emp));
      setToast({ message: 'Employee updated!', type: 'success' });
      setEditingId(null);
      setEditForm({});
    } catch (err: any) {
      setToast({ message: err?.response?.data?.detail || 'Edit failed', type: 'error' });
    }
    setLoading(false);
  };
  const handleDownload = async (emp: any) => {
    setLoading(true);
    try {
      const employeeData = {
        name: `${emp.surname} ${emp.name}`,
      };
      const blob = await pdf(
        <EmployeePDF data={employeeData} stand={new Date().toLocaleDateString()} />
      ).toBlob();
      const filename = `${emp.surname || ''}_${emp.name || ''}.pdf`;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setToast({ message: 'Download failed', type: 'error' });
    }
    setLoading(false);
  };
  React.useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    // Fetch employees from backend on mount
    axios.get(`${API_BASE_URL}/employees/list`)
      .then(res => {
        setEmployees(res.data);
      })
      .catch(() => {
        setEmployees([]);
      });
  }, []);

  const filtered = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    emp.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative bg-white/70 backdrop-blur-2xl border border-blue-100 rounded-2xl shadow-2xl p-6 mt-8" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}>
      {/* Animated gradient border and floating glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400/40 via-cyan-400/30 to-blue-700/10 blur-lg animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-700/10 via-cyan-400/30 to-blue-400/40 blur-lg animate-pulse" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-gradient-to-b from-blue-200/40 via-blue-400/20 to-blue-100/0 rounded-full blur-xl" />
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 z-10 relative">
        <h2 className="text-xl font-bold text-blue-900">Employees</h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search employees..."
            className="px-4 py-2 rounded border border-blue-200 focus:ring-2 focus:ring-blue-300 bg-white/80 text-blue-900 placeholder-blue-400 transition"
            aria-label="Search employees"
          />
          <button onClick={openAdd} className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:scale-105 transition-transform">Add Employee</button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl z-10 relative">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-blue-100/60 text-blue-700">
              <th className="px-4 py-2 text-left font-semibold">ID</th>
              <th className="px-4 py-2 text-left font-semibold">Name</th>
              <th className="px-4 py-2 text-left font-semibold">Surname</th>
              <th className="px-4 py-2 text-left font-semibold">ID Number</th>
              <th className="px-4 py-2 text-left font-semibold">Birth Date</th>
              <th className="px-4 py-2 text-left font-semibold">Sex</th>
              <th className="px-4 py-2 text-left font-semibold">Nationality</th>
              <th className="px-4 py-2 text-left font-semibold">Personal Number</th>
              <th className="px-4 py-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="py-8 text-center text-blue-400 animate-pulse">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} className="py-8 text-center text-blue-400">No employees found.</td></tr>
            ) : filtered.map((emp, idx) => (
              <tr key={emp.id} className="even:bg-blue-50/40 hover:bg-blue-100/60 transition rounded-xl">
                <td className="px-4 py-2 text-blue-900">{idx + 1}</td>
                {editingId === emp.id ? (
                  <>
                    <td className="px-4 py-2"><input name="name" value={editForm.name} onChange={handleEditChange} className="px-2 py-1 rounded border border-blue-200 w-full" /></td>
                    <td className="px-4 py-2"><input name="surname" value={editForm.surname} onChange={handleEditChange} className="px-2 py-1 rounded border border-blue-200 w-full" /></td>
                    <td className="px-4 py-2"><input name="id_number" value={editForm.id_number} onChange={handleEditChange} className="px-2 py-1 rounded border border-blue-200 w-full" /></td>
                    <td className="px-4 py-2"><input name="birth_date" value={editForm.birth_date} onChange={handleEditChange} className="px-2 py-1 rounded border border-blue-200 w-full" /></td>
                    <td className="px-4 py-2"><input name="sex" value={editForm.sex} onChange={handleEditChange} className="px-2 py-1 rounded border border-blue-200 w-full" /></td>
                    <td className="px-4 py-2"><input name="nationality" value={editForm.nationality} onChange={handleEditChange} className="px-2 py-1 rounded border border-blue-200 w-full" /></td>
                    <td className="px-4 py-2"><input name="personal_number" value={editForm.personal_number} onChange={handleEditChange} className="px-2 py-1 rounded border border-blue-200 w-full" /></td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2 text-blue-900 cursor-pointer hover:bg-blue-200/60" onClick={() => startEdit(emp)}>{emp.name}</td>
                    <td className="px-4 py-2 text-blue-900 cursor-pointer hover:bg-blue-200/60" onClick={() => startEdit(emp)}>{emp.surname}</td>
                    <td className="px-4 py-2 text-blue-900 cursor-pointer hover:bg-blue-200/60" onClick={() => startEdit(emp)}>{emp.id_number}</td>
                    <td className="px-4 py-2 text-blue-900 cursor-pointer hover:bg-blue-200/60" onClick={() => startEdit(emp)}>{emp.birth_date}</td>
                    <td className="px-4 py-2 text-blue-900 cursor-pointer hover:bg-blue-200/60" onClick={() => startEdit(emp)}>{emp.sex}</td>
                    <td className="px-4 py-2 text-blue-900 cursor-pointer hover:bg-blue-200/60" onClick={() => startEdit(emp)}>{emp.nationality}</td>
                    <td className="px-4 py-2 text-blue-900 cursor-pointer hover:bg-blue-200/60" onClick={() => startEdit(emp)}>{emp.personal_number}</td>
                  </>
                )}
                <td className="px-4 py-2 flex gap-2">
                  {editingId === emp.id ? (
                    <button onClick={saveEdit} className="px-3 py-1 rounded bg-green-500 text-white font-semibold hover:bg-green-600 transition flex items-center gap-1"><FaCheck />Save</button>
                  ) : (
                    <>
                      <button className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition flex items-center gap-1" title="Download" onClick={() => handleDownload(emp)} disabled={loading}><FaDownload /></button>
                      <button onClick={() => setConfirmDelete({ open: true, id: emp.id })} className="px-3 py-1 rounded bg-blue-50 text-blue-500 font-semibold hover:bg-blue-100 transition">Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal for Add/Edit */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/40 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-blue-100 flex flex-col gap-4 animate-fade-in" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}>
            <h3 className="text-lg font-bold text-blue-900 mb-2">Scan ID Card to Add Employee</h3>
            <input type="file" accept="image/*" onChange={handleFileChange} required className="px-4 py-2 rounded border border-blue-200 bg-white/80 text-blue-900" />
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:scale-105 transition-transform">Scan & Add</button>
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded-full bg-blue-50 text-blue-500 font-semibold hover:bg-blue-100 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}
      {/* Confirm Delete */}
      {confirmDelete.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/40 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 w-full max-w-xs border border-blue-100 flex flex-col gap-4 animate-fade-in" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}>
            <div className="text-blue-900 font-bold">Delete this employee?</div>
            <div className="flex gap-2 mt-2">
              <button onClick={handleDelete} className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:scale-105 transition-transform">Delete</button>
              <button onClick={() => setConfirmDelete({ open: false })} className="px-4 py-2 rounded-full bg-blue-50 text-blue-500 font-semibold hover:bg-blue-100 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 px-6 py-3 rounded-xl shadow-lg font-semibold text-white ${toast.type === 'success' ? 'bg-gradient-to-r from-blue-500 to-blue-400' : 'bg-red-500'} animate-fade-in`} style={{ boxShadow: '0 4px 24px 0 rgba(56,189,248,0.10)' }}>{toast.message}</div>
      )}
    </div>
  );
} 