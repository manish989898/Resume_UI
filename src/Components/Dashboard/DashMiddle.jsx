import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function DashMiddle() {
  const [processed, setProcessed] = useState(null);
  const [mismatched, setMismatched] = useState(null);
  const [rejectionReasons, setRejectionReasons] = useState([]);

  useEffect(() => {
    fetch('https://arsync.online/billbridge/api/invoice-processed-vs-mismatch')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setProcessed(data.processed ?? 0);
        setMismatched(data.mismatched ?? 0);
      })
      .catch(() => {
        setProcessed(0);
        setMismatched(0);
      });

    fetch('https://arsync.online/billbridge/api/rejection-reasons')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setRejectionReasons(data.reasons ?? []))
      .catch(() => setRejectionReasons([]));
  }, []);

  // Brand-aligned blue shades for charts
  const bluePrimary = '#1B61AD';
  const blueLight = '#3b82f6';
  const blueSoft = '#60a5fa';

  const barData = {
    labels: ['Invoices Processed', 'Invoices Mismatched'],
    datasets: [
      {
        label: 'Count',
        data: [processed ?? 0, mismatched ?? 0],
        backgroundColor: [bluePrimary, blueLight],
        borderRadius: 12,
        borderWidth: 2,
        hoverBackgroundColor: ['#1557a0', '#2563eb'],
        barPercentage: 0.7,
        categoryPercentage: 0.6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: '#fff',
        titleColor: bluePrimary,
        bodyColor: '#111827',
        borderColor: bluePrimary,
        borderWidth: 1,
        padding: 12,
        caretSize: 8,
        displayColors: false,
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#374151', font: { weight: 'bold' } } },
      y: { beginAtZero: true, grid: { color: '#e0f2fe' }, ticks: { color: '#374151', font: { weight: 'bold' } } },
    },
    animation: { duration: 1200, easing: 'easeOutBounce' },
  };

  const rejectionBarData = {
    labels: rejectionReasons.map(r => r.reason),
    datasets: [
      {
        label: 'Count',
        data: rejectionReasons.map(r => r.count),
        backgroundColor: blueSoft,
        borderRadius: 12,
        borderWidth: 2,
        hoverBackgroundColor: blueLight,
        barPercentage: 0.7,
        categoryPercentage: 0.6,
      },
    ],
  };

  const rejectionBarOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: '#fff',
        titleColor: bluePrimary,
        bodyColor: '#111827',
        borderColor: bluePrimary,
        borderWidth: 1,
        padding: 12,
        caretSize: 8,
        displayColors: false,
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#1e40af', font: { weight: 'bold' } } },
      y: {
        beginAtZero: true,
        grid: { color: '#e0f2fe' },
        ticks: {
          precision: 0,
          stepSize: 1,
          color: '#1e40af',
          font: { weight: 'bold' },
          callback: function (value) {
            return Number.isInteger(value) ? value : null;
          },
        },
      },
    },
    animation: { duration: 1200, easing: 'easeOutBounce' },
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 w-full px-2 md:px-0">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md border border-blue-200/60 p-6 flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2">
          <h2 className="text-xl font-bold text-blue-800 tracking-wide">Invoice Processed vs Mismatch</h2>
          <select className="text-sm border border-blue-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-gray-700 bg-white">
            <option>This Year</option>
            <option>This Month</option>
          </select>
        </div>
        <div className="h-60 flex items-center justify-center">
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="flex flex-wrap gap-4 mt-6 justify-center">
          <div className="flex items-center gap-2 text-sm text-blue-800 font-semibold">
            <div className="w-4 h-4 rounded-full bg-[#1B61AD]"></div> Invoices Processed
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold">
            <div className="w-4 h-4 rounded-full bg-[#3b82f6]"></div> Invoices Mismatched
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-2xl shadow-md border border-sky-200/60 p-6 flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2">
          <h2 className="text-xl font-bold text-blue-800 tracking-wide">Rejected Reasons</h2>
          <select className="text-sm border border-blue-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-gray-700 bg-white">
            <option>This Year</option>
            <option>This Month</option>
          </select>
        </div>
        <div className="h-60 flex items-center justify-center">
          {rejectionReasons.length > 0 ? (
            <Bar data={rejectionBarData} options={rejectionBarOptions} />
          ) : (
            <span className="text-blue-600 font-semibold">Loading...</span>
          )}
        </div>
        <div className="grid grid-cols-1 gap-2 mt-6 text-sm text-blue-700">
          {rejectionReasons.map(r => (
            <div key={r.reason} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="font-semibold">{r.reason}: {r.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
