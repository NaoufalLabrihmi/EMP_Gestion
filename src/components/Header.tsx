import React from 'react';
import { BellIcon, UserCircleIcon } from './icons';
import { NavLink, useLocation } from 'react-router-dom';

const nav = [
  { name: 'Dashboard', path: '/' },
  { name: 'Employees', path: '/employees' },
  { name: 'Projects', path: '/projects' },
  { name: 'Settings', path: '/settings' },
];

export default function Header() {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-4 md:py-5 animate-slide-in-down rounded-b-2xl border-b border-blue-100" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}>
      <div className="flex items-center gap-8 w-full md:w-auto">
        <div className="flex items-center gap-3">
          <span className="text-2xl md:text-3xl font-extrabold text-blue-900 tracking-tight drop-shadow flex items-center gap-2">
            gestionEmpl
            <span className="block h-1 w-8 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 rounded-full animate-pulse mt-1" />
          </span>
        </div>
        <nav className="flex gap-2 md:gap-4 ml-2">
          {nav.map(item => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-base ${isActive ? 'bg-gradient-to-r from-blue-500/90 to-blue-400/80 text-white shadow scale-105' : 'text-blue-900 hover:bg-blue-100 hover:scale-105'}`
              }
              aria-current={location.pathname === item.path ? 'page' : undefined}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4 mt-4 md:mt-0">
        <button className="relative p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition shadow-md" aria-label="Notifications">
          <BellIcon />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        </button>
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow ring-2 ring-blue-200 ml-2">
          <UserCircleIcon />
        </div>
      </div>
    </header>
  );
} 