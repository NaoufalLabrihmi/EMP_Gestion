import React from 'react';

type AreaData = { month: string; value: number }[];
type DonutData = { label: string; value: number; color: string }[];

interface ChartSectionProps {
  areaData: AreaData;
  donutData: DonutData;
}

export default function ChartSection({ areaData, donutData }: ChartSectionProps) {
  // Area chart points
  const maxValue = Math.max(...areaData.map(d => d.value));
  const points = areaData.map((d, i) => {
    const x = (i / (areaData.length - 1)) * 320;
    const y = 120 - (d.value / maxValue) * 100;
    return [x, y];
  });
  const areaPath = `M0,120 L${points.map(([x, y]) => `${x},${y}`).join(' ')} L320,120 Z`;
  const linePath = `M${points.map(([x, y]) => `${x},${y}`).join(' ')}`;

  // Donut chart
  const total = donutData.reduce((sum, d) => sum + d.value, 0);
  let acc = 0;
  const donutSegments = donutData.map((d, i) => {
    const start = acc;
    const length = (d.value / total) * 301.59;
    acc += length;
    return (
      <circle
        key={d.label}
        cx="60" cy="60" r="48"
        stroke={d.color}
        strokeWidth="18"
        fill="none"
        strokeDasharray="301.59"
        strokeDashoffset={301.59 - start}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s' }}
      />
    );
  });

  return (
    <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Area Chart Card */}
      <div className="bg-gradient-to-br from-blue-50/80 via-white/80 to-blue-100/80 border border-blue-200/60 rounded-2xl shadow-xl p-6 flex flex-col items-center backdrop-blur-2xl">
        <h3 className="text-base md:text-lg font-bold text-blue-900 mb-3">User Growth</h3>
        <svg viewBox="0 0 320 120" fill="none" className="w-full h-32 md:h-40">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#areaGradient)" />
          <path d={linePath} stroke="#38bdf8" strokeWidth="3" fill="none" />
        </svg>
        <div className="flex justify-between w-full mt-2 text-xs text-blue-400">
          {areaData.map(d => <span key={d.month}>{d.month}</span>)}
        </div>
      </div>
      {/* Donut Chart Card */}
      <div className="bg-gradient-to-br from-blue-50/80 via-white/80 to-blue-100/80 border border-blue-200/60 rounded-2xl shadow-xl p-6 flex flex-col items-center backdrop-blur-2xl">
        <h3 className="text-base md:text-lg font-bold text-blue-900 mb-3">Employee Distribution</h3>
        <svg viewBox="0 0 120 120" className="w-24 h-24 md:w-32 md:h-32">
          <circle cx="60" cy="60" r="48" stroke="#e0e7ef" strokeWidth="18" fill="none" />
          {donutSegments}
        </svg>
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs md:text-sm">
          {donutData.map(d => (
            <div key={d.label} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full block" style={{ background: d.color }} />{d.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 