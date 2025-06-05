import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import ChartSection from './components/ChartSection';
import Employees from './pages/Employees';

const stats = [
  { label: 'Total Users', value: '1,234' },
  { label: 'Active Projects', value: '87' },
  { label: 'Revenue', value: '$45,000' },
  { label: 'Growth', value: '+12%' },
];

const areaChartData = [
  { month: 'Jan', value: 100 },
  { month: 'Feb', value: 180 },
  { month: 'Mar', value: 160 },
  { month: 'Apr', value: 220 },
  { month: 'May', value: 260 },
  { month: 'Jun', value: 300 },
  { month: 'Jul', value: 350 },
  { month: 'Aug', value: 400 },
  { month: 'Sep', value: 420 },
  { month: 'Oct', value: 480 },
  { month: 'Nov', value: 500 },
  { month: 'Dec', value: 600 },
];

const donutChartData = [
  { label: 'Active', value: 60, color: '#38bdf8' },
  { label: 'On Leave', value: 25, color: '#0ea5e9' },
  { label: 'Inactive', value: 10, color: '#818cf8' },
  { label: 'Contract', value: 5, color: '#a5b4fc' },
];

function Dashboard() {
  return (
    <main className="flex-1 p-6 md:p-10 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-2 md:mt-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>
      <ChartSection areaData={areaChartData} donutData={donutChartData} />
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex bg-blue-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
        </Routes>
      </div>
    </div>
  );
}
