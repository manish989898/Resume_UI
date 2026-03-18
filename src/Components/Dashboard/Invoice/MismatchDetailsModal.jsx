import React from 'react';
import { FaTimes } from 'react-icons/fa';

// Static mismatch details data
const MISMATCH_DETAILS_DATA = [
  { invoice_number: 'INV-2026-88003', mismatch_type: 'DISCOUNT_MISMATCH_CONTRACT' },
  { invoice_number: 'INV-2026-88004', mismatch_type: 'PRICE_MISMATCH_PO' },
  { invoice_number: 'INV-2026-88001', mismatch_type: 'PO_REFERENCE_MISMATCH' },
  { invoice_number: 'INV-2026-88002', mismatch_type: 'ROUNDING_DIFF' },
];

// Format mismatch_type for display (e.g. DISCOUNT_MISMATCH_CONTRACT -> Discount Mismatch (Contract))
function formatMismatchType(type) {
  return type
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

export default function MismatchDetailsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Mismatch Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Invoice Number
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Mismatch Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {MISMATCH_DETAILS_DATA.map((row, index) => (
                  <tr
                    key={`${row.invoice_number}-${row.mismatch_type}-${index}`}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                      {row.invoice_number}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatMismatchType(row.mismatch_type)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
