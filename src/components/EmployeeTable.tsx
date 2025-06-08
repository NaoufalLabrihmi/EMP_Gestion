import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../lib/api';
import { FaCheck, FaDownload, FaChevronLeft, FaChevronRight, FaPlus, FaTimes, FaTrash, FaEdit } from 'react-icons/fa';
import { pdf } from '@react-pdf/renderer';
import EmployeePDF from './EmployeePDF';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 7;

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [modal, setModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id?: number }>({ open: false });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/employees/list`)
      .then(res => {
        setEmployees(res.data);
      })
      .catch(() => setEmployees([]));
  }, []);

  const filtered = useMemo(() => {
    if (!search) return employees;
    return employees.filter(emp =>
      Object.values(emp).some(val =>
        (val !== null && val !== undefined ? String(val) : '').toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [employees, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const columns = [
    { key: 'vorname', label: 'Vorname', className: 'min-w-[120px] flex-2' },
    { key: 'geburtsname', label: 'Geburtsname', className: 'min-w-[120px] flex-2' },
    { key: 'id_number', label: 'ID Number', className: 'min-w-[120px] flex-2' },
    { key: 'geburtsdatum', label: 'Geburtsdatum', className: 'min-w-[120px] flex-2' },
    { key: 'geschlecht', label: 'Geschlecht', className: 'min-w-[100px] flex-2' },
    { key: 'staatsangehoerigkeit', label: 'Staatsangehörigkeit', className: 'min-w-[100px] flex-1' },
    { key: 'personal_number', label: 'Personalnummer', className: 'min-w-[100px] flex-1' },
  ];

  const openAdd = () => {
    setFile(null);
    setModal(true);
  };
  const closeModal = () => setModal(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      setEmployees(emps => [...emps, emp]);
        setToast({ message: 'Employee added from scan!', type: 'success' });
        closeModal();
      } catch (err: any) {
        setToast({ message: err?.response?.data?.detail || 'Scan failed', type: 'error' });
      }
      setLoading(false);
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
      const res = await axios.patch(`${API_BASE_URL}/employees/edit/${editingId}`, editForm);
      const updated = res.data.employee;
      setEmployees(emps => emps.map(emp => emp.id === editingId ? updated : emp));
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
      // Fetch full employee data from backend
      const res = await axios.get(`${API_BASE_URL}/employees/pdf/${emp.id}`);
      const employeeData = res.data;
      const blob = await pdf(
        <EmployeePDF data={employeeData} stand={new Date().toLocaleDateString()} />
      ).toBlob();
      const filename = `${employeeData.vorname || ''}_${employeeData.geburtsname || ''}.pdf`;
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

  return (
    <div className="w-full max-w-7xl mx-auto my-4 px-2 md:px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 z-10 relative px-1">
        <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight drop-shadow-lg flex items-center gap-2">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Employees</span>
        </h2>
        <div className="flex gap-2 items-center w-full md:w-auto">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search..."
            className="px-4 py-2 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-300 bg-white/80 text-blue-900 placeholder-blue-400 transition w-full md:w-64 shadow text-sm"
            aria-label="Search employees"
          />
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform text-base"
          >
            <FaPlus />
          </button>
        </div>
      </div>
      {/* Responsive Table/Card Layout */}
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-3xl border border-blue-100 shadow-2xl bg-white/80 backdrop-blur-xl">
          <table className="min-w-full text-base">
            <thead className="sticky top-0 z-20">
              <tr className="bg-gradient-to-r from-blue-100/80 via-cyan-100/80 to-blue-50/80 text-blue-800 text-sm">
                <th className="px-3 py-2 text-left font-bold">#</th>
                {columns.map(col => (
                  <th key={col.key} className="px-3 py-2 text-left font-bold whitespace-nowrap text-sm">{col.label}</th>
                ))}
                <th className="px-3 py-2 text-left font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={columns.length + 2} className="py-12 text-center text-blue-400 animate-pulse text-base">Loading...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={columns.length + 2} className="py-12 text-center text-blue-400 text-base">No employees found.</td></tr>
              ) : paginated.map((emp, idx) => (
                <tr key={emp.id} className={`group even:bg-blue-50/60 odd:bg-white/80 hover:shadow-xl hover:scale-[1.01] transition-all duration-200 rounded-2xl ${editingId === emp.id ? 'ring-2 ring-cyan-400' : ''}`} style={{ fontSize: '1.08rem' }}>
                  <td className="px-3 py-2 text-blue-900 font-bold text-sm">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  {editingId === emp.id ? (
                    columns.map(col => (
                      <td key={col.key} className={`px-3 py-2 align-top ${col.className || ''} group-hover:bg-cyan-50/60 transition rounded-xl`.trim()}>
                        <input
                          name={col.key}
                          value={editForm[col.key] ?? ''}
                          onChange={handleEditChange}
                          className="px-2 py-1 rounded-lg border border-blue-200 w-full bg-white/90 shadow text-sm font-medium focus:ring-2 focus:ring-cyan-400"
                          style={{ minWidth: 0 }}
                        />
                      </td>
                    ))
                  ) : (
                    columns.map(col => (
                      <td
                        key={col.key}
                        className={`px-3 py-2 text-blue-900 max-w-[140px] truncate cursor-pointer group-hover:bg-cyan-50/60 transition rounded-xl text-sm font-medium ${col.className || ''}`.trim()}
                        title={emp[col.key] ?? ''}
                        onClick={() => startEdit(emp)}
                      >
                        {emp[col.key] ?? ''}
                      </td>
                    ))
                  )}
                  <td className="px-3 py-2 flex gap-2 items-center justify-center group-hover:bg-cyan-50/60 transition rounded-xl">
                    {editingId === emp.id ? (
                      <>
                        <button onClick={saveEdit} title="Save" className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow hover:scale-110 transition flex items-center justify-center" disabled={loading}><FaCheck /></button>
                        <button onClick={cancelEdit} title="Cancel" className="p-2 rounded-xl bg-gray-200 text-blue-700 shadow hover:bg-gray-300 transition flex items-center justify-center" disabled={loading}><FaTimes /></button>
                      </>
                    ) : (
                      <>
                        <button className="p-2 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 shadow hover:scale-110 transition flex items-center justify-center" title="Download" onClick={() => handleDownload(emp)} disabled={loading}><FaDownload /></button>
                        <button onClick={() => navigate(`/employees/${emp.id}/edit`)} title="Edit" className="p-2 rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-300 text-yellow-700 shadow hover:scale-110 transition flex items-center justify-center" disabled={loading}><FaEdit /></button>
                        <button onClick={() => setConfirmDelete({ open: true, id: emp.id })} title="Delete" className="p-2 rounded-xl bg-gradient-to-r from-red-100 to-pink-100 text-red-600 shadow hover:scale-110 transition flex items-center justify-center" disabled={loading}><FaTrash /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Card layout for mobile */}
      <div className="block md:hidden space-y-4 text-base">
        {loading ? (
          <div className="py-8 text-center text-blue-400 animate-pulse text-base">Loading...</div>
        ) : paginated.length === 0 ? (
          <div className="py-8 text-center text-blue-400 text-base">No employees found.</div>
        ) : paginated.map((emp, idx) => (
          <div key={emp.id} className="rounded-2xl shadow-xl border border-blue-100 bg-gradient-to-br from-white/90 via-blue-50/90 to-cyan-50/90 p-4 flex flex-col gap-2 hover:scale-[1.01] hover:shadow-2xl transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-blue-900 font-bold text-xl">{emp.vorname} {emp.geburtsname}</div>
              <div className="flex gap-2">
                <button className="p-2 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 shadow hover:scale-110 transition flex items-center justify-center" title="Download" onClick={() => handleDownload(emp)} disabled={loading}><FaDownload /></button>
                <button onClick={() => navigate(`/employees/${emp.id}/edit`)} title="Edit" className="p-2 rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-300 text-yellow-700 shadow hover:scale-110 transition flex items-center justify-center" disabled={loading}><FaEdit /></button>
                <button onClick={() => setConfirmDelete({ open: true, id: emp.id })} title="Delete" className="p-2 rounded-xl bg-gradient-to-r from-red-100 to-pink-100 text-red-600 shadow hover:scale-110 transition flex items-center justify-center" disabled={loading}><FaTrash /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {columns.map(col => (
                <div key={col.key} className="flex flex-col">
                  <span className="text-blue-400 font-semibold">{col.label}</span>
                  <span className="text-blue-900 font-medium truncate">{emp[col.key] ?? ''}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 px-1">
        <div className="text-blue-700 text-sm font-semibold">
          Page {page} of {totalPages} <span className="text-blue-400 font-normal">({filtered.length} employees)</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 rounded-xl bg-blue-100 text-blue-700 font-bold shadow hover:bg-blue-200 transition disabled:opacity-50 flex items-center gap-2 text-sm"
            aria-label="Previous page"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 rounded-xl bg-blue-100 text-blue-700 font-bold shadow hover:bg-blue-200 transition disabled:opacity-50 flex items-center gap-2 text-sm"
            aria-label="Next page"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
      {/* Add Employee Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/40 backdrop-blur-xl animate-fade-in">
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white/90 via-blue-50/90 to-cyan-50/90 rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-blue-100 flex flex-col gap-6 animate-fade-in relative">
            <button type="button" onClick={closeModal} className="absolute top-4 right-4 text-blue-400 hover:text-blue-700 text-2xl"><FaTimes /></button>
            <h3 className="text-xl font-extrabold text-blue-900 mb-2 text-center">Add Employee by Scanning ID</h3>
            <input type="file" accept="image/*" onChange={handleFileChange} required className="px-4 py-2 rounded-xl border border-blue-200 bg-white/80 text-blue-900 shadow text-sm" />
            <button type="submit" className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform text-base" disabled={loading}>Scan & Add</button>
          </form>
        </div>
      )}
      {/* Confirm Delete */}
      {confirmDelete.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/40 backdrop-blur-xl animate-fade-in">
          <div className="bg-gradient-to-br from-white/90 via-blue-50/90 to-cyan-50/90 rounded-3xl shadow-2xl p-8 w-full max-w-xs border border-blue-100 flex flex-col gap-6 animate-fade-in">
            <div className="text-blue-900 font-extrabold text-lg text-center">Delete this employee?</div>
            <div className="flex gap-3 mt-2 justify-center">
              <button onClick={handleDelete} className="bg-gradient-to-r from-red-500 to-pink-400 text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform text-base" disabled={loading}>Delete</button>
              <button onClick={() => setConfirmDelete({ open: false })} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-500 font-bold shadow hover:bg-blue-100 transition text-base" disabled={loading}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 px-6 py-3 rounded-2xl shadow-2xl font-bold text-white text-base ${toast.type === 'success' ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : 'bg-gradient-to-r from-red-500 to-pink-400'} animate-fade-in`} style={{ boxShadow: '0 4px 24px 0 rgba(56,189,248,0.10)' }}>{toast.message}</div>
      )}
    </div>
  );
} 