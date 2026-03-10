/**
 * Mock data and constants for Invoice Workbench UI.
 * Status: 'green' | 'yellow' | 'red'
 */

export const SUMMARY_CARDS = [
  { label: 'PROMISE TO PAY', sublabel: 'NUMBER OF PROMISES', value: 20, borderColor: 'border-l-blue-500'  },
  { label: 'ESCALATIONS RAISED', sublabel: 'NUMBER OF ESCALATIONS', value: 8, borderColor: 'border-l-red-500' },
  { label: 'DISPUTES OPENED', sublabel: 'NUMBER OF DISPUTES', value: 10, borderColor: 'border-l-purple-500' },
  { label: 'FULLY PAID', sublabel: 'INVOICE COUNT', value: 400, borderColor: 'border-l-green-500' },
  { label: 'PARTIALLY PAID', sublabel: 'INVOICE COUNT', value: 14, borderColor: 'border-l-yellow-400' },
];

/** Customers with score in range 1–100. Status derived in UI: >80 green, 60–80 yellow, <60 red. */
export const CUSTOMERS = [
  { id: '1', name: 'Quantum Group', score: 92 },
  { id: '2', name: 'Veridian Data', score: 85 },
  { id: '3', name: 'Echo Ventures', score: 78 },
  { id: '4', name: 'Global Dyn.', score: 72 },
  { id: '5', name: 'Apex Systems', score: 88 },
  { id: '6', name: 'Alpha Sol.', score: 65 },
  { id: '7', name: 'Beta Group', score: 55 },
  { id: '8', name: 'Zeta Analytics', score: 70 },
  { id: '9', name: 'Fusion Corp', score: 82 },
  { id: '10', name: 'Horizon Tech', score: 61 },
  { id: '11', name: 'Gamma Sys.', score: 45 },
  { id: '12', name: 'Delta Corp', score: 58 },
  { id: '13', name: 'Epsilon Part.', score: 90 },
  { id: '14', name: 'Iota Systems', score: 52 },
];

/** Invoices: company and value in descending order; amounts in dollars. */
export const INVOICES = [
  { id: 'INV-1001', customer: 'Quantum Group', customerType: 'building', amount: '$148,000', dueDays: 15, reminderSent: 1, status: 'green' },
  { id: 'INV-1002', customer: 'Veridian Data', customerType: 'globe', amount: '$130,500', dueDays: 22, reminderSent: 2, status: 'yellow' },
  { id: 'INV-1003', customer: 'Echo Ventures', customerType: 'building', amount: '$110,200', dueDays: 30, reminderSent: 1, status: 'green' },
  { id: 'INV-1004', customer: 'Global Dyn.', customerType: 'building', amount: '$105,000', dueDays: 45, reminderSent: 4, status: 'yellow' },
  { id: 'INV-1005', customer: 'Apex Systems', customerType: 'leaf', amount: '$98,000', dueDays: 20, reminderSent: 4, status: 'green' },
  { id: 'INV-1006', customer: 'Alpha Sol.', customerType: 'building', amount: '$88,750', dueDays: 38, reminderSent: 1, status: 'yellow' },
  { id: 'INV-1007', customer: 'Beta Group', customerType: 'globe', amount: '$79,000', dueDays: 52, reminderSent: 4, status: 'red' },
  { id: 'INV-1008', customer: 'Zeta Analytics', customerType: 'building', amount: '$72,000', dueDays: 28, reminderSent: 2, status: 'yellow' },
  { id: 'INV-1009', customer: 'Fusion Corp', customerType: 'building', amount: '$65,500', dueDays: 40, reminderSent: 4, status: 'green' },
  { id: 'INV-1010', customer: 'Horizon Tech', customerType: 'leaf', amount: '$60,000', dueDays: 18, reminderSent: 2, status: 'yellow' },
  { id: 'INV-1011', customer: 'Gamma Sys.', customerType: 'building', amount: '$58,000', dueDays: 60, reminderSent: 4, status: 'red' },
  { id: 'INV-1012', customer: 'Delta Corp', customerType: 'globe', amount: '$52,000', dueDays: 35, reminderSent: 4, status: 'yellow' },
  { id: 'INV-1013', customer: 'Epsilon Part.', customerType: 'building', amount: '$48,000', dueDays: 25, reminderSent: 1, status: 'green' },
  { id: 'INV-1014', customer: 'Iota Systems', customerType: 'leaf', amount: '$45,000', dueDays: 42, reminderSent: 4, status: 'red' },
];

export const ACTION_HISTORY = [
  { id: 1, type: 'dispute', text: 'Dispute opened for INV-3087', time: 'Today, 3:45 PM', iconType: 'dispute' },
  { id: 2, type: 'promise', text: 'Promise to pay logged for INV-2045', time: 'Today, 1:15 PM', iconType: 'promise' },
  { id: 3, type: 'paid', text: 'Marked INV-1023 as Paid', time: 'Yesterday, 4:30 PM', iconType: 'paid' },
  { id: 4, type: 'reminder', text: 'Reminder sent for INV-4571', time: 'Apr 20, 2:00 PM', iconType: 'reminder' },
];

export const WORKBENCH_SUMMARY = {
  totalInvoices: 500,
  overdue: 100,
  pendingAmount: '$15M',
};

/** Tailwind classes for status colors (bar and badge). Badges use solid opaque colors. */
export const STATUS_CLASSES = {
  green: { bar: 'bg-green-500', badge: 'bg-green-500 text-white' },
  yellow: { bar: 'bg-yellow-400', badge: 'bg-yellow-400 text-white' },
  red: { bar: 'bg-red-500', badge: 'bg-red-500 text-white' },
};
