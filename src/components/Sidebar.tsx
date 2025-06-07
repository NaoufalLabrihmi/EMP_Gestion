import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon } from './icons';

const nav = [
  { name: 'Dashboard', path: '/', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z" /></svg>
  ) },
  { name: 'Employees', path: '/employees', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87M16 3.13a4 4 0 0 1 0 7.75M8 3.13a4 4 0 0 0 0 7.75" /></svg>
  ) },
  { name: 'Projects', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7v4a1 1 0 0 0 1 1h3v9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-9h3a1 1 0 0 0 1-1V7" /></svg>
  ) },
  { name: 'Settings', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7zm7.94-2.06a1 1 0 0 0 .26-1.09l-1.1-3.18a1 1 0 0 0-.76-.65l-3.19-.47a1 1 0 0 0-.9.27l-2.25 2.25a1 1 0 0 0-.27.9l.47 3.19a1 1 0 0 0 .65.76l3.18 1.1a1 1 0 0 0 1.09-.26l2.25-2.25z" /></svg>
  ) },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside
      className={`transition-all duration-300 group/sidebar ${collapsed ? 'w-20' : 'w-72'} min-h-screen bg-white/70 backdrop-blur-2xl shadow-2xl flex flex-col items-center py-12 px-2 md:px-6 relative overflow-hidden border-r border-blue-100`}
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400/40 via-cyan-400/30 to-blue-700/10 blur-lg animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-700/10 via-cyan-400/30 to-blue-400/40 blur-lg animate-pulse" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-gradient-to-b from-blue-200/40 via-blue-400/20 to-blue-100/0 rounded-full blur-xl" />
      </div>
      <button
        className="absolute top-4 right-4 md:hidden z-20 p-2 rounded hover:bg-blue-100"
        onClick={() => setCollapsed(c => !c)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <MenuIcon /> : <XIcon />}
      </button>
      <div className={`mb-12 flex flex-col items-center z-10 transition-all duration-300 ${collapsed ? 'scale-90' : ''}`}>
        {/* Glowing floating logo */}
        <div className="relative w-20 h-20 flex items-center justify-center mb-2">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-300 via-blue-100 to-white blur-2xl opacity-70 animate-pulse" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-200 via-blue-100 to-white shadow-xl flex items-center justify-center ring-4 ring-white/30 relative z-10">
            <span className="text-3xl font-black text-blue-700 drop-shadow">G</span>
          </div>
        </div>
        {!collapsed && <div className="text-lg font-bold text-blue-700 tracking-tight">gestionEmpl</div>}
      </div>
      {/* Section divider */}
      <div className="w-4/5 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400/40 to-blue-100 rounded-full mb-8 opacity-70" />
      <nav className="mt-2 flex flex-col gap-2 w-full z-10">
        {nav.map(item => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${location.pathname === item.path ? 'bg-gradient-to-r from-blue-500/90 to-blue-400/80 text-white shadow-lg scale-105' : 'text-blue-900 hover:bg-blue-100 hover:scale-105'} ${collapsed ? 'justify-center' : ''}`}
            aria-current={location.pathname === item.path ? 'page' : undefined}
            style={{ boxShadow: location.pathname === item.path ? '0 4px 24px 0 rgba(56,189,248,0.10)' : undefined }}
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-10 text-xs text-blue-400 z-10 flex flex-col items-center w-full">
        <span>&copy; 2024 gestionEmpl</span>
      </div>
    </aside>
  );
} 