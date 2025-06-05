import React from 'react';
import { BellIcon, UserCircleIcon } from './icons';

export default function Header() {
  return (
    <header className="relative bg-white/70 backdrop-blur-xl shadow-xl flex items-center justify-between px-6 md:px-12 py-5 md:py-7 animate-slide-in-down rounded-b-2xl border-b border-blue-100" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}>
      <div className="absolute left-0 top-0 w-40 h-40 bg-gradient-to-br from-blue-200/40 via-white/30 to-blue-100/0 rounded-full blur-2xl -z-10 animate-pulse" />
      <div className="absolute right-0 top-0 w-32 h-16 bg-gradient-to-tr from-blue-300/30 via-blue-100/10 to-white/0 rounded-full blur-2xl -z-10 animate-pulse" />
      <div className="relative">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 tracking-tight drop-shadow flex items-center gap-2">
          Dashboard
          <span className="block h-1 w-8 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 rounded-full animate-pulse mt-1" />
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <form className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="px-5 py-2 rounded-full border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white/80 text-blue-900 placeholder-blue-400 transition shadow-md"
            aria-label="Search"
          />
        </form>
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