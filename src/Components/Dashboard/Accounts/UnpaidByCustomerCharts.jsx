import React from 'react';
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { UNPAID_BY_CUSTOMER } from './accountsReceivableData';

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

/**
 * Panel: "Unpaid invoices amount by customer (Top 10)" with horizontal bar chart,
 * donut chart, and legend. Same data and colors for both charts.
 */
export default function UnpaidByCustomerCharts() {
  const labels = UNPAID_BY_CUSTOMER.map((d) => d.customer);
  const amounts = UNPAID_BY_CUSTOMER.map((d) => d.amount);
  const colors = UNPAID_BY_CUSTOMER.map((d) => d.color);

  const barData = {
    labels,
    datasets: [
      {
        label: 'Unpaid Amount',
        data: amounts,
        backgroundColor: colors,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` $ ${ctx.raw?.toLocaleString() ?? 0}`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 160000,
        ticks: {
          stepSize: 40000,
          callback: (value) => value >= 0 ? value.toLocaleString() : '',
        },
        grid: { color: '#e5e7eb' },
      },
      y: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
    },
  };

  const doughnutData = {
    labels,
    datasets: [
      {
        data: amounts,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = total ? ((ctx.raw / total) * 100).toFixed(1) : 0;
            return ` ${ctx.label}: $ ${ctx.raw?.toLocaleString() ?? 0} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-6">
        Unpaid invoices amount by customer (Top 10)
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80">
          <Bar data={barData} options={barOptions} />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-56 h-56 shrink-0">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <ul className="flex flex-col gap-2 w-full">
            {UNPAID_BY_CUSTOMER.map((row) => (
              <li key={row.customer} className="flex items-center gap-2 text-sm">
                <span
                  className="w-3 h-3 rounded shrink-0"
                  style={{ backgroundColor: row.color }}
                  aria-hidden
                />
                <span className="text-gray-700 truncate">{row.customer}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
