/**
 * Data and constants for Accounts Receivable page.
 */

export const SUMMARY_CARDS = [
  { amount: '$15M', label: 'Total Amount Invoiced' },
  { amount: '$8.25M', label: 'Outstanding Amount' },
  { amount: '$6.75M', label: 'Pending Amount Due' },
  { amount: '$4.2M', label: 'Overdue Invoices – 30+ Days' },
  { amount: '$2.6M', label: 'Overdue Invoices – 60+ Days' },
  { amount: '$1.45M', label: 'Overdue Invoices – 90+ Days' },
];

/** Top 10+ customers with unpaid amount (same companies as Invoice Workbench, descending). Colors match bar/donut chart. */
export const UNPAID_BY_CUSTOMER = [
  { customer: 'Quantum Group', amount: 148000, color: 'rgb(59, 130, 246)' },
  { customer: 'Veridian Data', amount: 130500, color: 'rgb(20, 184, 166)' },
  { customer: 'Echo Ventures', amount: 110200, color: 'rgb(15, 118, 110)' },
  { customer: 'Global Dyn.', amount: 105000, color: 'rgb(34, 197, 94)' },
  { customer: 'Apex Systems', amount: 98000, color: 'rgb(163, 230, 53)' },
  { customer: 'Alpha Sol.', amount: 88750, color: 'rgb(234, 179, 8)' },
  { customer: 'Beta Group', amount: 79000, color: 'rgb(249, 115, 22)' },
  { customer: 'Zeta Analytics', amount: 72000, color: 'rgb(239, 68, 68)' },
  { customer: 'Fusion Corp', amount: 65500, color: 'rgb(99, 102, 241)' },
  { customer: 'Horizon Tech', amount: 60000, color: 'rgb(139, 92, 246)' },
  { customer: 'Gamma Sys.', amount: 58000, color: 'rgb(168, 85, 247)' },
  { customer: 'Delta Corp', amount: 52000, color: 'rgb(192, 132, 252)' },
  { customer: 'Epsilon Part.', amount: 48000, color: 'rgb(217, 70, 239)' },
  { customer: 'Iota Systems', amount: 45000, color: 'rgb(236, 72, 153)' },
];
