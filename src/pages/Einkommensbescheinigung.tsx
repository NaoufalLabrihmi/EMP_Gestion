import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaFilePdf, FaUpload } from 'react-icons/fa';
import { API_BASE_URL } from '../lib/api';

const API_BASE = API_BASE_URL || window.location.origin;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const columns = [
  { key: 'monat', label: 'Monat', className: 'min-w-[60px]' },
  { key: 'jahr', label: 'Jahr', className: 'min-w-[70px]' },
  { key: 'eintritt', label: 'Eintritt', className: 'min-w-[100px]' },
  { key: 'stkl', label: 'StKl', className: 'min-w-[60px]' },
  { key: 'krankenkasse', label: 'Krankenkasse', className: 'min-w-[160px]' },
  { key: 'betrag', label: 'Betrag', className: 'min-w-[80px]' },
  { key: 'kv_brutto', label: 'KV-Brutto', className: 'min-w-[90px]' },
  { key: 'sv_abzug', label: 'SV-Abzug', className: 'min-w-[90px]' },
  { key: 'netto', label: 'Netto', className: 'min-w-[80px]' },
];

const EinkommensbescheinigungPage = () => {
  const query = useQuery();
  const employeeId = query.get('employeeId');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const fileInputRef = useRef(null);

  const fetchEmployeeName = async () => {
    if (!employeeId) return;
    try {
      const res = await axios.get(`${API_BASE}/employees/pdf/${employeeId}`);
      if (res.data && (res.data.vorname || res.data.geburtsname)) {
        setEmployeeName(`${res.data.vorname || ''} ${res.data.geburtsname || ''}`.trim());
      } else {
        setEmployeeName('');
      }
    } catch {
      setEmployeeName('');
    }
  };

  const fetchData = async () => {
    if (!employeeId) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/einkommensbescheinigung/list?employeeId=${employeeId}`);
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError('Fehler beim Laden der Daten.');
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployeeName();
    fetchData();
    // eslint-disable-next-line
  }, [employeeId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setUploading(true);
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    try {
      await axios.post(`${API_BASE}/employees/${employeeId}/einkommensbescheinigung/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('PDF erfolgreich hochgeladen und verarbeitet!');
      fetchData();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Fehler beim Hochladen.');
    }
    setUploading(false);
    if (fileInputRef.current) (fileInputRef.current as HTMLInputElement).value = '';
  };

  if (!employeeId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-xl text-red-600 font-bold">
        Kein Mitarbeiter ausgewählt.
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      {/* Table Section */}
      <div className="flex-1 bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-6 flex flex-wrap items-center gap-2 font-sans">
          <FaFilePdf className="text-green-600" />
          <span>Einkommensbescheinigung</span>
          {employeeName && (
            <span className="ml-2 text-2xl md:text-3xl font-bold text-cyan-700 font-sans whitespace-nowrap">
              für&nbsp;{employeeName}
            </span>
          )}
        </h2>
        {error ? (
          <div className="text-red-600">{error}</div>
        ) : loading ? (
          <div className="text-gray-500">Lade Daten...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  {columns.map(col => (
                    <th key={col.key} className={`text-left py-2 px-3 bg-blue-50 font-semibold ${col.className}`}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!Array.isArray(data) || data.length === 0 ? (
                  <tr><td colSpan={columns.length} className="text-center text-gray-400 py-6">Keine Einträge gefunden.</td></tr>
                ) : (
                  data.map((row: any) => (
                    <tr key={row.id} className="hover:bg-blue-50 transition">
                      {columns.map(col => (
                        <td key={col.key} className="py-2 px-3 border-b border-gray-100">{row[col.key] || '-'}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Upload Section */}
      <div className="w-full md:w-[340px] flex-shrink-0">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center gap-4">
          <div className="bg-green-100 rounded-full p-4 mb-2">
            <FaFilePdf className="text-4xl text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">PDF hochladen</h3>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={handleUpload}
            disabled={uploading}
          />
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow hover:scale-105 transition"
            onClick={() => fileInputRef.current && (fileInputRef.current as HTMLInputElement).click()}
            disabled={uploading}
          >
            <FaUpload /> PDF auswählen
          </button>
          {uploading && !error && <div className="text-blue-600 mt-2">Wird hochgeladen...</div>}
          {success && <div className="text-green-600 mt-2">{success}</div>}
          {error && !loading && <div className="text-red-600 mt-2">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default EinkommensbescheinigungPage; 