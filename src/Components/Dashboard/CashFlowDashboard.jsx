import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  LineController,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Chart, Doughnut } from 'react-chartjs-2';
import { FaArrowUp, FaArrowDown, FaBuilding, FaMoneyBillWave } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  LineController,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
);

const FORECAST_PERIODS = ['Next 13 Weeks', 'Next 26 Weeks', 'Next 52 Weeks'];

// 12-week chart: W1..W13
const weeklyLabels = Array.from({ length: 13 }, (_, i) => `W${i + 1}`);
const inflowsData = [320, 280, 350, 400, 380, 290, 310, 340, 360, 280, 300, 320, 340];
const outflowsData = [250, 300, 280, 320, 350, 400, 380, 300, 320, 350, 380, 400, 420];
const cashBalanceData = [295, 325, 395, 475, 505, 395, 325, 365, 405, 335, 255, 175, 95];
const forecastBalanceData = [null, null, null, null, null, null, null, null, null, 400, 380, 360, 340];

const chart12WeekData = {
  labels: weeklyLabels,
  datasets: [
    {
      type: 'bar',
      label: 'Inflows',
      data: inflowsData.map((v) => v * 1000),
      backgroundColor: 'rgba(34, 197, 94, 0.7)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 1,
      yAxisID: 'y',
    },
    {
      type: 'bar',
      label: 'Outflows',
      data: outflowsData.map((v) => v * 1000),
      backgroundColor: 'rgba(239, 68, 68, 0.7)',
      borderColor: 'rgb(239, 68, 68)',
      borderWidth: 1,
      yAxisID: 'y',
    },
    {
      type: 'line',
      label: 'Cash Balance',
      data: cashBalanceData.map((v) => v * 1000),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.3,
      pointRadius: 4,
      yAxisID: 'y',
    },
    {
      type: 'line',
      label: 'Forecast',
      data: forecastBalanceData.map((v) => (v != null ? v * 1000 : null)),
      borderColor: 'rgb(59, 130, 246)',
      borderDash: [5, 5],
      pointRadius: 3,
      yAxisID: 'y',
    },
  ],
};

const chart12WeekOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'top',
      labels: { usePointStyle: true, padding: 16 },
    },
  },
  scales: {
    y: {
      type: 'linear',
      min: 0,
      max: 1400000,
      ticks: {
        callback: (v) => (v >= 1000 ? `$${v / 1000}k` : v),
      },
      grid: { color: 'rgba(0,0,0,0.06)' },
    },
    x: {
      grid: { display: false },
    },
  },
};

// 6-month outlook
const monthLabels = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const sixMonthInflows = [3.2, 3.8, 4.2, 3.6, 4.0, 3.4];
const sixMonthOutflows = [2.8, 3.2, 3.6, 3.4, 3.8, 4.0];
const sixMonthNet = [0.4, 0.6, 0.6, 0.2, 0.2, -0.6];

const sixMonthData = {
  labels: monthLabels,
  datasets: [
    {
      type: 'bar',
      label: 'Inflows',
      data: sixMonthInflows.map((v) => v * 1e6),
      backgroundColor: 'rgba(34, 197, 94, 0.7)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 1,
      yAxisID: 'y',
    },
    {
      type: 'bar',
      label: 'Outflows',
      data: sixMonthOutflows.map((v) => v * 1e6),
      backgroundColor: 'rgba(239, 68, 68, 0.7)',
      borderColor: 'rgb(239, 68, 68)',
      borderWidth: 1,
      yAxisID: 'y',
    },
    {
      type: 'line',
      label: 'Net',
      data: sixMonthNet.map((v) => v * 1e6),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'transparent',
      tension: 0.3,
      pointRadius: 4,
      yAxisID: 'y',
    },
  ],
};

const sixMonthOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top', labels: { usePointStyle: true } },
  },
  scales: {
    y: {
      type: 'linear',
      ticks: {
        callback: (v) => (v >= 1e6 ? `$${v / 1e6}M` : v >= 1000 ? `$${v / 1000}k` : v),
      },
      grid: { color: 'rgba(0,0,0,0.06)' },
    },
    x: { grid: { display: false } },
  },
};

// AR Aging donut
const arAgingData = {
  labels: ['0-30 Days', '31-60 Days', '61-90 Days', '90+ Days'],
  datasets: [
    {
      data: [500000, 700000, 150000, 100000],
      backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e'],
      borderWidth: 0,
    },
  ],
};
const arAgingOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12 } },
  },
};

export default function CashFlowDashboard() {
  const [forecastPeriod, setForecastPeriod] = useState('Next 13 Weeks');

  return (
    <div className="w-full px-2 md:px-0">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cash Flow Forecast Dashboard</h1>
          <p className="text-gray-600">
            Based on Accounts Receivable & Payment Trends
            <span className="text-sm text-gray-500 ml-2">• Updated: Today, 10:45 AM</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="forecast-period" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Forecast Period:
          </label>
          <select
            id="forecast-period"
            value={forecastPeriod}
            onChange={(e) => setForecastPeriod(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-[#1B61AD] focus:outline-none focus:ring-1 focus:ring-[#1B61AD] min-w-[140px]"
          >
            {FORECAST_PERIODS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {/* Top row: 5 summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-lg text-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Opening Balance</p>
                <p className="text-2xl font-bold mt-1">$295,000</p>
                <p className="text-green-600 text-xs font-medium mt-1 flex items-center gap-1">
                  <FaArrowUp className="w-3 h-3" /> 3.2% vs last month
                </p>
              </div>
              <FaBuilding className="w-8 h-8 text-blue-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-lg text-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Expected Inflows</p>
                <p className="text-2xl font-bold mt-1">$950,000</p>
                <p className="text-gray-600 text-xs mt-1">Confirmed $625k · Probable $325k</p>
              </div>
              <FaArrowUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-lg text-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Planned Outflows</p>
                <p className="text-2xl font-bold mt-1">$770,000</p>
                <div className="flex gap-1 mt-2">
                  <span className="flex-1 h-1.5 bg-red-400 rounded" style={{ width: '40%' }} title="Payroll" />
                  <span className="flex-1 h-1.5 bg-red-500 rounded" style={{ width: '35%' }} title="Vendors" />
                  <span className="flex-1 h-1.5 bg-red-600 rounded" style={{ width: '25%' }} title="Opex" />
                </div>
                <p className="text-gray-500 text-xs mt-1">Payroll · Vendors · Opex</p>
              </div>
              <FaArrowDown className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-lg text-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Net Cash Position</p>
                <p className="text-2xl font-bold mt-1">$475,000</p>
                <p className="text-green-600 text-xs font-medium mt-1 flex items-center gap-1">
                  <FaArrowUp className="w-3 h-3" /> Surplus
                </p>
              </div>
              <FaMoneyBillWave className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-lg text-gray-800">
            <p className="text-gray-500 text-sm font-medium">DSO & Efficiency</p>
            <p className="text-2xl font-bold mt-1">58 Days</p>
            <p className="text-green-600 text-xs font-medium mt-1">▲ +13%</p>
            <p className="text-gray-600 text-xs mt-2">Collection Efficiency</p>
            <div className="h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '72%' }} />
            </div>
            <p className="text-gray-500 text-xs mt-1">72%</p>
          </div>
        </div>

        {/* 12-Week chart + AR Aging + Scenario */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-xl shadow-lg p-5 text-gray-800">
            <h3 className="text-lg font-bold mb-4">12-Week Cash Flow Forecast</h3>
            <div className="relative h-[320px]">
              <div
                className="absolute left-0 right-0 bottom-0 h-16 bg-red-500/10 border border-red-500/30 rounded pointer-events-none z-0"
                style={{ bottom: '0%', height: '22%' }}
                aria-hidden
              />
              <div className="relative z-10 h-full">
                <Chart type="bar" data={chart12WeekData} options={chart12WeekOptions} />
              </div>
            </div>
            <p className="text-red-600 text-sm mt-2 font-medium">Risk Zone</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5 text-gray-800">
            <h3 className="text-lg font-bold mb-4">AR Aging Breakdown</h3>
            <div className="h-48">
              <Doughnut
                data={arAgingData}
                options={arAgingOptions}
              />
            </div>
            <p className="text-center text-sm font-semibold text-gray-700 mt-2">Total · $1.3M</p>
            <ul className="mt-3 space-y-1 text-xs text-gray-600">
              <li className="flex justify-between"><span>0-30 Days</span><span>$500k · Low</span></li>
              <li className="flex justify-between"><span>31-60 Days</span><span>$700k</span></li>
              <li className="flex justify-between"><span>61-90 Days</span><span>$150k · High</span></li>
              <li className="flex justify-between"><span>90+ Days</span><span>$100k · Critical</span></li>
            </ul>
          </div>
        </div>

        {/* Scenario Analysis + Collection Health + Top Customers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-5 text-gray-800">
            <h3 className="text-lg font-bold mb-4">Scenario Analysis</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                <p className="text-xs font-medium text-gray-500">Best</p>
                <p className="text-xl font-bold text-green-700">$1.05M</p>
                <p className="text-green-600 text-xs mt-1">▲ $655k</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                <p className="text-xs font-medium text-gray-500">Expected</p>
                <p className="text-xl font-bold text-blue-700">$600k</p>
                <p className="text-green-600 text-xs mt-1">▲ $600k</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                <p className="text-xs font-medium text-gray-500">Worst</p>
                <p className="text-xl font-bold text-red-700">$450k</p>
                <p className="text-red-600 text-xs mt-1">▼ $150k</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5 text-gray-800">
            <h3 className="text-lg font-bold mb-4">Collection Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">DSO</span>
                <span className="font-semibold">58 Days</span>
              </div>
              <p className="text-xs text-gray-500">Target: &lt;45</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">On-Time %</span>
                <span className="font-semibold">72%</span>
              </div>
              <p className="text-xs text-gray-500">Target: &gt;85%</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Dispute Rate</span>
                <span className="font-semibold">9%</span>
              </div>
              <p className="text-xs text-gray-500">Target: &lt;25%</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5 text-gray-800">
            <h3 className="text-lg font-bold mb-4">Top Customers by Risk</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-medium text-left">
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Outstanding</th>
                    <th className="pb-2">Delay</th>
                    <th className="pb-2">Probability</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">ABC Ltd</td>
                    <td className="py-2">$100k</td>
                    <td className="py-2">45 Days</td>
                    <td className="py-2 text-red-600 font-medium">65%</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">XYZ Inc</td>
                    <td className="py-2">$100k</td>
                    <td className="py-2">60 Days</td>
                    <td className="py-2 text-orange-600 font-medium">40%</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">DEF Corp</td>
                    <td className="py-2">$75k</td>
                    <td className="py-2">90 Days</td>
                    <td className="py-2 text-green-600 font-medium">25%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Collections Action Center */}
        <div className="bg-white rounded-xl shadow-lg p-5 text-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Collections Action Center</h3>
            <button type="button" className="p-1 rounded hover:bg-gray-100 text-gray-500">
              <span className="text-xl leading-none">⋯</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-medium text-left">
                  <th className="pb-2">Invoice</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Issue</th>
                  <th className="pb-2">Action</th>
                  <th className="pb-2">Owner</th>
                  <th className="pb-2">SLA</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2">INV-556</td>
                  <td className="py-2">ABC Ltd</td>
                  <td className="py-2 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Dispute</td>
                  <td className="py-2"><button type="button" className="text-blue-600 font-medium hover:underline">Resolve</button></td>
                  <td className="py-2">Ramesh</td>
                  <td className="py-2"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs">48h</span></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2">INV-778</td>
                  <td className="py-2">XYZ Inc</td>
                  <td className="py-2 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Delay</td>
                  <td className="py-2"><button type="button" className="text-blue-600 font-medium hover:underline">Auto-Call</button></td>
                  <td className="py-2">Anil</td>
                  <td className="py-2"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs">24h</span></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2">INV-669</td>
                  <td className="py-2">DEF Corp</td>
                  <td className="py-2 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Missing PO</td>
                  <td className="py-2"><button type="button" className="text-blue-600 font-medium hover:underline">Request</button></td>
                  <td className="py-2">Mike</td>
                  <td className="py-2"><span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs">12h</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 6-Month Outlook */}
        <div className="bg-white rounded-xl shadow-lg p-5 text-gray-800">
          <h3 className="text-lg font-bold mb-4">6-Month Outlook</h3>
          <div className="relative h-[280px]">
            <Chart type="bar" data={sixMonthData} options={sixMonthOptions} />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">Funding Need $150k</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
