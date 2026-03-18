import React, { useState, useMemo } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Swal from 'sweetalert2';

// Static data aligned with mismatch details: INV-2026-88003, INV-2026-88004, INV-2026-88001, INV-2026-88002
// Carousel shows one slide per invoice (4 slides)
const INVOICE_REVIEW_DATA = [
  {
    invoice_number: 'INV-2026-88003',
    company_name: 'Atlantic Food Logistics',
    po: 'PO-2026-77003',
    contract: 'SDA-2026-1103',
    status: 'Human Approval',
    severity: 'MED',
    variance: '$14,120',
    mismatches: [
      {
        mismatch_type: 'DISCOUNT_MISMATCH_CONTRACT',
        field: 'discount_pct',
        invoiceValue: '5%',
        expectedValue: '7%',
        aiFixJson: { action: 'SET_DISCOUNT_PCT', from: '5%', to: '7%' },
      },
    ],
    evidence: {
      contract: {
        title: 'CONTRACT · SDA-2026-1103 · Page 2',
        details: ['discount_pct = 7%', 'Volume Discount: 7% applies to all standard SKUs.'],
        path: 's3://demo/contracts/SDA-2026-1103.pdf',
      },
      invoice: {
        title: 'INVOICE · INV-2026-88003 · Page 1',
        details: ['discount_pct = 5%', 'Discount: 5%'],
        path: 's3://demo/invoices/INV-2026-88003.pdf',
      },
    },
  },
  {
    invoice_number: 'INV-2026-88004',
    company_name: 'Pacific Supply Co',
    po: 'PO-2026-77004',
    contract: 'SDA-2026-1104',
    status: 'Human Approval',
    severity: 'MED',
    variance: '$2,340',
    mismatches: [
      {
        mismatch_type: 'PRICE_MISMATCH_PO',
        field: 'unit_price',
        invoiceValue: '$12.50',
        expectedValue: '$11.00',
        aiFixJson: { action: 'SET_UNIT_PRICE', from: '$12.50', to: '$11.00' },
      },
    ],
    evidence: {
      contract: {
        title: 'CONTRACT · SDA-2026-1104 · Page 1',
        details: ['unit_price = $11.00', 'Agreed unit price for SKU-8821'],
        path: 's3://demo/contracts/SDA-2026-1104.pdf',
      },
      invoice: {
        title: 'INVOICE · INV-2026-88004 · Page 1',
        details: ['unit_price = $12.50', 'Line Total: $1,234.56'],
        path: 's3://demo/invoices/INV-2026-88004.pdf',
      },
    },
  },
  {
    invoice_number: 'INV-2026-88001',
    company_name: 'Central Wholesale Inc',
    po: 'PO-2026-77001',
    contract: 'SDA-2026-1101',
    status: 'Human Approval',
    severity: 'MED',
    variance: '$0',
    mismatches: [
      {
        mismatch_type: 'PO_REFERENCE_MISMATCH',
        field: 'po_reference',
        invoiceValue: 'PO-2025-66001',
        expectedValue: 'PO-2026-77001',
        aiFixJson: { action: 'SET_PO_REFERENCE', from: 'PO-2025-66001', to: 'PO-2026-77001' },
      },
    ],
    evidence: {
      contract: {
        title: 'CONTRACT · SDA-2026-1101 · Page 1',
        details: ['po_reference = PO-2026-77001', 'Referenced PO for this order.'],
        path: 's3://demo/contracts/SDA-2026-1101.pdf',
      },
      invoice: {
        title: 'INVOICE · INV-2026-88001 · Page 1',
        details: ['po_reference = PO-2025-66001', 'PO Reference: PO-2025-66001'],
        path: 's3://demo/invoices/INV-2026-88001.pdf',
      },
    },
  },
  {
    invoice_number: 'INV-2026-88002',
    company_name: 'Metro Distribution Ltd',
    po: 'PO-2026-77002',
    contract: 'SDA-2026-1102',
    status: 'Human Approval',
    severity: 'LOW',
    variance: '$0.01',
    mismatches: [
      {
        mismatch_type: 'ROUNDING_DIFF',
        field: 'line_total',
        invoiceValue: '$1,234.56',
        expectedValue: '$1,234.55',
        aiFixJson: { action: 'SET_LINE_TOTAL', from: '$1,234.56', to: '$1,234.55' },
      },
    ],
    evidence: {
      contract: {
        title: 'CONTRACT · SDA-2026-1102 · Page 1',
        details: ['line_total = $1,234.55', 'Calculated total after rounding.'],
        path: 's3://demo/contracts/SDA-2026-1102.pdf',
      },
      invoice: {
        title: 'INVOICE · INV-2026-88002 · Page 1',
        details: ['line_total = $1,234.56', 'Line Total: $1,234.56'],
        path: 's3://demo/invoices/INV-2026-88002.pdf',
      },
    },
  },
];

export default function HumanVerificationReviewModal({ isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aiFixedOption, setAiFixedOption] = useState('');

  const current = useMemo(
    () => INVOICE_REVIEW_DATA[currentIndex] ?? INVOICE_REVIEW_DATA[0],
    [currentIndex]
  );
  const total = INVOICE_REVIEW_DATA.length;
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < total - 1;

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () => setCurrentIndex((i) => Math.min(total - 1, i + 1));

  const handleApprove = () => {
    Swal.fire({
      icon: 'success',
      title: 'Invoice Approved',
      html: `<p style="color:#4b5563;font-size:15px;margin-top:8px;">${current.invoice_number} has been approved successfully.</p>`,
      confirmButtonText: 'Done',
      confirmButtonColor: '#16a34a',
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        title: 'swal-title-custom',
        confirmButton: 'swal-confirm-custom',
      },
      showClass: { popup: 'swal2-show' },
      hideClass: { popup: 'swal2-hide' },
      width: 420,
    });
  };

  const handleReject = () => {
    Swal.fire({
      icon: 'error',
      title: 'Invoice Rejected',
      html: `<p style="color:#4b5563;font-size:15px;margin-top:8px;">${current.invoice_number} has been rejected and sent for human fix.</p>`,
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc2626',
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        title: 'swal-title-custom',
        confirmButton: 'swal-confirm-custom',
      },
      showClass: { popup: 'swal2-show' },
      hideClass: { popup: 'swal2-hide' },
      width: 420,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header with close */}
        <div className="flex items-start justify-between gap-4 p-5 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Invoice Review</h2>
            <p className="text-lg font-bold text-gray-800 mt-1">{current.invoice_number}</p>
            <p className="text-lg font-bold text-gray-800">{current.company_name}</p>
            <p className="text-sm text-gray-500 mt-1">
              PO: {current.po} · Contract: {current.contract}
            </p>
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 text-sm font-medium text-gray-700">
                Status: {current.status}
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 text-sm font-medium text-gray-700">
                Severity: {current.severity}
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 text-sm font-medium text-gray-700">
                Variance: {current.variance}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-end gap-2 rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="ai-fixed-options" className="text-xs font-medium text-gray-500 whitespace-nowrap">
                  AI Fixed Options
                </label>
                <select
                  id="ai-fixed-options"
                  value={aiFixedOption}
                  onChange={(e) => setAiFixedOption(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-[#1B61AD] focus:outline-none focus:ring-1 focus:ring-[#1B61AD] min-w-[100px]"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => {}}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white font-medium text-sm hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Score
              </button>
            </div>
            <button
              type="button"
              onClick={handleApprove}
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors"
            >
              Reject → Human Fix
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Carousel controls + content */}
        <div className="flex flex-1 min-h-0 px-2 sm:px-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={!canPrev}
            className="self-center p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none shrink-0"
            aria-label="Previous invoice"
          >
            <FaChevronLeft className="text-xl" />
          </button>

          <div className="flex-1 overflow-y-auto min-w-0 py-4 px-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mismatches column */}
              <div className="border border-gray-200 rounded-xl p-4 flex flex-col">
                <h3 className="text-base font-bold text-gray-800 mb-3">Mismatches</h3>
                <div className="space-y-4 flex-1">
                  {current.mismatches.map((m, i) => (
                    <div
                      key={`${m.mismatch_type}-${i}`}
                      className="border border-gray-200 rounded-xl p-4 bg-gray-50/80"
                    >
                      <p className="font-bold text-gray-800">{m.mismatch_type}</p>
                      <p className="text-sm text-gray-600 mt-1">field: {m.field}</p>
                      <div className="flex gap-3 mt-3">
                        <div className="flex-1 rounded-lg border border-gray-200 bg-white p-3">
                          <p className="text-xs font-medium text-gray-500">Invoice</p>
                          <p className="text-sm font-semibold text-gray-800">{m.invoiceValue}</p>
                        </div>
                        <div className="flex-1 rounded-lg border border-gray-200 bg-white p-3">
                          <p className="text-xs font-medium text-gray-500">Expected</p>
                          <p className="text-sm font-semibold text-gray-800">{m.expectedValue}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-600 mb-1">AI Suggested Fix (JSON)</p>
                        <pre className="text-xs bg-white border border-gray-200 rounded-lg p-3 text-gray-700 overflow-x-auto">
                          {JSON.stringify(m.aiFixJson, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence column */}
              <div className="border border-gray-200 rounded-xl p-4 flex flex-col">
                <h3 className="text-base font-bold text-gray-800 mb-3">Evidence</h3>
                <div className="space-y-4 flex-1">
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/80">
                    <p className="font-semibold text-gray-800 text-sm">{current.evidence.contract.title}</p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      {current.evidence.contract.details.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-blue-600 truncate" title={current.evidence.contract.path}>
                      {current.evidence.contract.path}
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/80">
                    <p className="font-semibold text-gray-800 text-sm">{current.evidence.invoice.title}</p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      {current.evidence.invoice.details.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-blue-600 truncate" title={current.evidence.invoice.path}>
                      {current.evidence.invoice.path}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={!canNext}
            className="self-center p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none shrink-0"
            aria-label="Next invoice"
          >
            <FaChevronRight className="text-xl" />
          </button>
        </div>

        {/* Carousel indicator */}
        <div className="flex justify-center gap-2 py-3 border-t border-gray-200 shrink-0">
          <span className="text-sm text-gray-600">
            {currentIndex + 1} of {total}
          </span>
        </div>
      </div>
    </div>
  );
}
