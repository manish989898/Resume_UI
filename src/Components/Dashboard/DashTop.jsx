import React, { useEffect, useState } from 'react';
// Add icon imports (using react-icons for demonstration)
import { FaMoneyBillWave, FaFileInvoice, FaClock, FaCalendarAlt, FaEnvelopeOpenText, FaReply, FaExclamationTriangle, FaHandshake } from 'react-icons/fa';

export default function DashTop() {
  const [balanceDue, setBalanceDue] = useState(null);
  const [invoicesDue, setInvoicesDue] = useState(null);
  const [dueOver60, setDueOver60] = useState(null);
  const [dueOver30, setDueOver30] = useState(null);
  const [lessThan30, setLessThan30] = useState(null);
  const [emailRemindersSent, setEmailRemindersSent] = useState(null);
  const [emailsOpened, setEmailsOpened] = useState(null); // new state
  const [replies, setReplies] = useState(null);
  const [processing, setProcessing] = useState({
    paid: null,
    processed: null,
    rejected: null,
    sent: null,
    topRejectionReasons: [],
  });
  const [promiseToPay, setPromiseToPay] = useState(0);
  const [escalations, setEscalations] = useState(0);

  useEffect(() => {
    fetch('https://arsync.online/billbridge/api/total-balance-due')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setBalanceDue(data.total ?? 'N/A'))
      .catch(() => setBalanceDue('N/A'));
  }, []);

  useEffect(() => {
    fetch('https://arsync.online/billbridge/api/number-of-invoices-due')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setInvoicesDue(data.count ?? 'N/A'))
      .catch(() => setInvoicesDue('N/A'));
  }, []);

  useEffect(() => {
    fetch('https://arsync.online/billbridge/api/due-over-60-days')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setDueOver60(data.count ?? 'N/A'))
      .catch(() => setDueOver60('N/A'));
  }, []);

  useEffect(() => {
    fetch('https://arsync.online/billbridge/api/due-over-30-days')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setDueOver30(data.count ?? 'N/A'))
      .catch(() => setDueOver30('N/A'));
  }, []);

  useEffect(() => {
    fetch('https://arsync.online/billbridge/api/less-than-30-days')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setLessThan30(data.count ?? 'N/A'))
      .catch(() => setLessThan30('N/A'));
  }, []);

  useEffect(() => {
    fetch('https://arsync.online/billbridge/api/number-of-email-reminders-sent')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setEmailRemindersSent(data.count ?? 'N/A'))
      .catch(() => setEmailRemindersSent('N/A'));
  }, []);

  useEffect(() => {
    fetch('https://arsync.online/billbridge/api/number-of-emails-opened')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setEmailsOpened(data.count ?? 'N/A'))
      .catch(() => setEmailsOpened('N/A'));
  }, []);

  useEffect(() => {
    fetch('https://arsync.online/billbridge/api/number-of-replies')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setReplies(data.count ?? 'N/A'))
      .catch(() => setReplies('N/A'));
  }, []);

  useEffect(() => {
    fetch('https://arsync.online/billbridge/api/processing-metrics')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setProcessing({
        paid: data.paid ?? 'N/A',
        processed: data.processed ?? 'N/A',
        rejected: data.rejected ?? 'N/A',
        sent: data.sent ?? 'N/A',
        topRejectionReasons: Array.isArray(data.topRejectionReasons) ? data.topRejectionReasons : [],
      }))
      .catch(() => setProcessing({
        paid: 'N/A',
        processed: 'N/A',
        rejected: 'N/A',
        sent: 'N/A',
        topRejectionReasons: [],
      }));
  }, []);

  useEffect(() => {
    fetch('https://arsync.online/billbridge/api/promise-to-pay-count')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setPromiseToPay(Number.isFinite(data.count) ? data.count : 0))
      .catch(() => setPromiseToPay(0));
  }, []);

  useEffect(() => {
    fetch('https://arsync.online/billbridge/api/number-of-escalations')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        // Handle array response
        if (Array.isArray(data)) {
          setEscalations(data.length);
        } else if (Number.isFinite(data.count)) {
          setEscalations(data.count);
        } else {
          setEscalations(0);
        }
      })
      .catch(() => setEscalations(0));
  }, []);


  const invoiceMetrics = [
    { title: "Amount_Due", value: balanceDue?.toLocaleString?.() ?? 'Loading...', subtitle: "Total unpaid amount", icon: <FaMoneyBillWave className="text-3xl text-blue-600 mb-2" /> },
    { title: "Invoices_Due", value: invoicesDue?.toLocaleString?.() ?? 'Loading...', subtitle: "", icon: <FaFileInvoice className="text-3xl text-blue-500 mb-2" /> },
    { title: "Due_Over_60 Days", value: dueOver60?.toLocaleString?.() ?? 'Loading...', subtitle: "", icon: <FaClock className="text-3xl text-blue-600 mb-2" /> },
    { title: "Due_Over_30 Days", value: dueOver30?.toLocaleString?.() ?? 'Loading...', subtitle: "", icon: <FaCalendarAlt className="text-3xl text-blue-500 mb-2" /> },
    { title: "Less_Than_30 Days", value: lessThan30?.toLocaleString?.() ?? 'Loading...', subtitle: "", icon: <FaCalendarAlt className="text-3xl text-blue-400 mb-2" /> },
  ];

  const engagementMetrics = [
    { title: "Number_Of_Email_Reminders_Sent", value: emailRemindersSent?.toLocaleString?.() ?? 'Loading...', subtitle: "", icon: <FaEnvelopeOpenText className="text-3xl text-blue-500 mb-2" /> },
    { title: "Number_Of_Emails_Open", value: emailsOpened?.toLocaleString?.() ?? 'Loading...', subtitle: "", icon: <FaEnvelopeOpenText className="text-3xl text-blue-600 mb-2" /> },
    { title: "Number_Of_Replies", value: replies?.toLocaleString?.() ?? 'Loading...', subtitle: "", icon: <FaReply className="text-3xl text-blue-500 mb-2" /> },
    { title: "Number_Of_Escalations", value: escalations !== null ? escalations.toLocaleString() : 'Loading...', subtitle: "", icon: <FaExclamationTriangle className="text-3xl text-blue-600 mb-2" /> },
  ];

  return (
    <div className="w-full px-2 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Invoice Metrics - brand blues, different shades */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md border border-blue-200/60 p-6">
          <h2 className="text-xl font-bold mb-6 text-blue-800 tracking-wide">Invoice Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {invoiceMetrics.map(({ title, value, subtitle, icon }) => (
              <div
                key={title}
                className="bg-white/90 p-5 rounded-xl border border-blue-100 shadow-sm text-center hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col items-center justify-center min-h-[140px]"
              >
                {icon}
                <p className="text-xs text-gray-600 mb-1 font-medium uppercase tracking-wider">{title.replace(/_/g, ' ')}</p>
                <p className="text-2xl font-extrabold text-blue-700 mb-1">{value}</p>
                {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
              </div>
            ))}
          </div>
          {/* Promise to Pay Metric */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4 text-blue-800 flex items-center gap-2"><FaHandshake className="text-2xl text-blue-600" /> Promise to Pay</h2>
            <div className="bg-blue-50/80 border border-blue-200 p-6 rounded-xl shadow-sm text-center flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-1 font-medium uppercase tracking-wider">Number of Promises</p>
              <p className="text-3xl font-extrabold text-blue-700">{promiseToPay}</p>
            </div>
          </div>
        </div>

        {/* Engagement + Processing Metrics - different blue shades */}
        <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-2xl shadow-md border border-sky-200/60 p-6">
          <h2 className="text-xl font-bold mb-6 text-blue-800 tracking-wide">Engagement Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {engagementMetrics.map(({ title, value, subtitle, icon }) => (
              <div
                key={title}
                className="bg-white/90 p-5 rounded-xl border border-blue-100 shadow-sm text-center hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col items-center justify-center min-h-[140px]"
              >
                {icon}
                <p className="text-xs text-gray-600 mb-1 font-medium uppercase tracking-wider">{title.replace(/_/g, ' ')}</p>
                <p className="text-2xl font-extrabold text-blue-700 mb-1">{value}</p>
                {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
              </div>
            ))}
          </div>

          {/* Processing Metrics */}
          <h2 className="text-lg font-semibold mt-12 mb-4 text-blue-800 tracking-wide">Processing Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-blue-50/80 border border-blue-200 p-5 rounded-xl shadow-sm text-center flex flex-col items-center">
              <p className="text-xs text-gray-600 mb-1 font-medium uppercase tracking-wider">Paid vs. Processed Invoices</p>
              <p className="text-2xl font-extrabold text-blue-700">
                {processing.paid !== null && processing.processed !== null
                  ? `${processing.paid} / ${processing.processed}`
                  : 'Loading...'}
              </p>
            </div>
            <div className="bg-blue-50/80 border border-blue-200 p-5 rounded-xl shadow-sm text-center flex flex-col items-center">
              <p className="text-xs text-gray-600 mb-1 font-medium uppercase tracking-wider">Rejected vs. Sent Invoices</p>
              <p className="text-2xl font-extrabold text-blue-700">
                {processing.rejected !== null && processing.sent !== null
                  ? `${processing.rejected} / ${processing.sent}`
                  : 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
