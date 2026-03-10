import React, { useState, useEffect } from 'react';
import DrillDownTable from './DrillDownTable';
import { fetchDrillDownData } from '../../../services/dashboardService';

export default function DrillDownModal({ isOpen, onClose, metricType, metricTitle }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && metricType) {
      fetchData();
    } else {
      // Reset state when modal closes
      setData([]);
      setError(null);
    }
  }, [isOpen, metricType]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDrillDownData(metricType);
      setData(result);
    } catch (err) {
      console.error('Error fetching drill-down data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Define columns based on metric type - using consistent column order
  const getColumns = () => {
    const baseColumns = [
      {
        key: 'sno',
        label: 'S.No',
        sortable: true,
        render: (row, index) => index + 1
      }
    ];

    // Special columns for escalations
    if (metricType === 'escalations' || metricType === 'number_of_escalations') {
      return [
        ...baseColumns,
        { key: 'customerName', label: 'Name', sortable: true },
        { key: 'invoiceId', label: 'Invoice ID', sortable: true },
        { key: 'invoiceFileName', label: 'Invoice File Name', sortable: true },
        { key: 'issueCount', label: 'Issue Count', sortable: true, type: 'number' },
        { key: 'compareDocumentType', label: 'Compare Document Type', sortable: true },
        { key: 'compareDocumentName', label: 'Compare Document Name', sortable: true },
        { 
          key: 'comments', 
          label: 'Comments', 
          sortable: false,
          render: (row) => {
            const comments = String(row.comments || 'N/A');
            // Truncate long comments and show tooltip
            if (comments.length > 100) {
              return (
                <span title={comments} className="cursor-help">
                  {comments.substring(0, 100)}...
                </span>
              );
            }
            return comments;
          }
        },
      ];
    }

    // Standard column order: S.No, Name, Email, Amount, Due Date, Bucket
    const standardColumns = [
      ...baseColumns,
      { key: 'customerName', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'amountPending', label: 'Amount', sortable: true, type: 'currency' },
      { key: 'dueDate', label: 'Due Date', sortable: true },
      { key: 'bucket', label: 'Bucket', sortable: true }
    ];

    // For all other metric types, use the standard column order
    return standardColumns;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {metricTitle || 'Detailed View'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Click column headers to sort</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchData}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <DrillDownTable data={data} columns={getColumns()} />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#1B61AD] text-white px-6 py-2 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

