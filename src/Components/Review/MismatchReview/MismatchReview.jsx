import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { rejectInvoice, selectAllInvoices, selectInvoice, fetchMismatchInvoices, selectMismatchStatus } from '../../../reduxToolkit/slices/invoiceSlice';

// Components
import InvoiceDetail from './InvoiceDetail';

export default function MismatchReview() {
  const invoices = useSelector(selectAllInvoices);
  const mismatchStatus = useSelector(selectMismatchStatus);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchMismatchInvoices());
  }, [dispatch]);

  const handleReject = (invoiceId) => {
    dispatch(rejectInvoice({ invoiceId }));
  };

  const handleViewDetails = (invoice) => {
    dispatch(selectInvoice(invoice));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-1">Mismatch Review</h2>
      <p className="text-gray-500 mb-4">Review, Approve, and Take Command.</p>

      <hr className='mb-4 border-gray-200' />

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-600">
              <th className="px-6 py-3 font-medium">INVOICE ID</th>
              <th className="px-6 py-3 font-medium">VENDOR NAME</th>
              <th className="px-6 py-3 font-medium">ISSUE COUNT</th>
              <th className="px-6 py-3 font-medium">DETAILS</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {mismatchStatus === 'loading' && (
              <tr>
                <td className="px-6 py-4 text-center text-gray-500" colSpan={4}>
                  Loading invoices...
                </td>
              </tr>
            )}
            {mismatchStatus !== 'loading' && invoices.length === 0 && (
              <tr>
                <td className="px-6 py-4 text-center text-gray-500" colSpan={4}>
                  No invoices found.
                </td>
              </tr>
            )}
            {invoices.map((ele, index) => (
              <tr key={index} className="border-b">
                <td className="px-6 py-4 text-blue-600 font-medium cursor-pointer hover:underline">
                  {ele.invoiceId}
                </td>
                <td className="px-6 py-4">{ele.vendor}</td>
                <td className="px-6 py-4">{ele.issueCount}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button 
                    onClick={() => handleReject(ele.invoiceId)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-white border border-red-600 hover:text-red-600 transition"
                  >
                    Reject
                  </button>
                  <button onClick={() => handleViewDetails(ele)} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm hover:bg-gray-300">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InvoiceDetail />
    </div>
  );
}