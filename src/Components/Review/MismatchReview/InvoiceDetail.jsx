import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearSelectedInvoice } from '../../../reduxToolkit/slices/invoiceSlice';

export default function InvoiceDetail() {
  const dispatch = useDispatch();
  const selectedInvoice = useSelector(state => state.invoices.selectedInvoice);

  if (!selectedInvoice) return null;

  const details = [
    { label: 'Invoice ID', value: selectedInvoice.invoiceId || 'N/A' },
    { label: 'Vendor Name', value: selectedInvoice.vendor || 'N/A' },
    { label: 'Issue Count', value: selectedInvoice.issueCount ?? 'N/A' },
    { label: 'Invoice File Name', value: selectedInvoice.invoiceFileName || 'N/A' },
    { label: 'Compare Document Type', value: selectedInvoice.compareDocumentType || 'N/A' },
    { label: 'Compare Document Name', value: selectedInvoice.compareDocumentName || 'N/A' },
  ];

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Invoice #{selectedInvoice.invoiceId} Details
              </h3>
              <button 
                onClick={() => dispatch(clearSelectedInvoice())}
                className="text-gray-500 hover:text-gray-700 font-4xl"
              >
                X
              </button>
            </div>

            {/* Invoice Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {details.map(({ label, value }) => (
                <div key={label}>
                  <p className="text-sm font-medium text-gray-500">{label}</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-500">Comments</p>
              <div className="mt-1 text-sm text-gray-900 bg-gray-50 rounded p-3">
                {selectedInvoice.comments || 'N/A'}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => dispatch(clearSelectedInvoice())}
                className="bg-[#1B61AD] text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}