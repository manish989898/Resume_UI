import React, { useState, useMemo, useEffect } from 'react';
import { FaBuilding, FaGlobe, FaLeaf, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { STATUS_CLASSES } from './invoiceWorkbenchData';

const DEFAULT_PAGE_SIZE = 5;

const CUSTOMER_ICONS = {
  building: FaBuilding,
  globe: FaGlobe,
  leaf: FaLeaf,
};

/**
 * Badge color for reminder count: red (1-3), purple (4). Solid opaque colors.
 */
function getReminderBadgeClass(reminderSent) {
  const count = reminderSent === '4+' ? 4 : Number(reminderSent);
  if (count >= 4) return 'bg-purple-500 text-white';
  return 'bg-red-500 text-white';
}

/** Display reminder count as number only (no "4+" or "="). */
function formatReminderDisplay(reminderSent) {
  return reminderSent === '4+' ? 4 : reminderSent;
}

export default function InvoiceTable({ invoices, pageSize: pageSizeProp }) {
  const pageSize = pageSizeProp ?? DEFAULT_PAGE_SIZE;
  const [currentPage, setCurrentPage] = useState(1);

  const { totalPages, paginatedInvoices, startIndex, endIndex, total } = useMemo(() => {
    const total = invoices.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const startIndex = (Math.min(currentPage, totalPages) - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const paginatedInvoices = invoices.slice(startIndex, endIndex);
    return {
      totalPages,
      paginatedInvoices,
      startIndex: total === 0 ? 0 : startIndex + 1,
      endIndex,
      total,
    };
  }, [invoices, currentPage, pageSize]);

  // Keep currentPage in valid range when invoices or pageSize change
  useEffect(() => {
    const totalPagesCalc = Math.max(1, Math.ceil(invoices.length / pageSize));
    if (currentPage > totalPagesCalc) {
      setCurrentPage(totalPagesCalc);
    }
  }, [invoices.length, pageSize, currentPage]);

  const goToPage = (page) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th className="px-4 py-3 font-semibold uppercase tracking-wider w-0" />
            <th className="px-4 py-3 font-semibold uppercase tracking-wider">Invoice Number</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-wider">Customer</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-wider">Amount</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-wider">Due Days</th>
            <th className="px-4 py-3 font-semibold uppercase tracking-wider">Reminder Sent</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedInvoices.map((inv) => {
            const statusStyles = STATUS_CLASSES[inv.status] || STATUS_CLASSES.green;
            const IconComponent = CUSTOMER_ICONS[inv.customerType] || FaBuilding;
            return (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-2 py-3 w-0">
                  <span className={`block w-1 h-10 rounded-full ${statusStyles.bar}`} aria-hidden />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{inv.id}</td>
                <td className="px-4 py-3 text-gray-700 flex items-center gap-2">
                  <IconComponent className="w-4 h-4 text-gray-500 shrink-0" />
                  {inv.customer}
                </td>
                <td className="px-4 py-3 text-gray-700">{inv.amount}</td>
                <td className="px-4 py-3 text-gray-700">{inv.dueDays}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold ${getReminderBadgeClass(inv.reminderSent)}`}
                  >
                    {formatReminderDisplay(inv.reminderSent)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      {total > pageSize && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm">
          <p className="text-gray-600">
            Showing <span className="font-medium">{startIndex}</span>–<span className="font-medium">{endIndex}</span> of{' '}
            <span className="font-medium">{total}</span> invoices
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-900 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              aria-label="Previous page"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                className={`min-w-[2rem] px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-[#1B61AD] text-white'
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-900 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              aria-label="Next page"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
