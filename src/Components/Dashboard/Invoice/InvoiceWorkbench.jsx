import React from 'react';
import CustomersSidebar from './CustomersSidebar';
import SummaryCards from './SummaryCards';
import InvoiceTable from './InvoiceTable';
import ActionHistory from './ActionHistory';
import {
  CUSTOMERS,
  SUMMARY_CARDS,
  INVOICES,
  ACTION_HISTORY,
  WORKBENCH_SUMMARY,
} from './invoiceWorkbenchData';

/**
 * Invoice Workbench: two-column layout with customer filter sidebar
 * and main content (summary cards, invoice table, action history).
 */
export default function InvoiceWorkbench() {
  return (
    <div className="w-full min-h-[calc(100vh-8rem)]">
      <div className="flex gap-8">
        <CustomersSidebar customers={CUSTOMERS} />

        <main className="flex-1 min-w-0">
          <SummaryCards cards={SUMMARY_CARDS} />

          <section className="mb-4">
            <h1 className="text-xl font-bold text-gray-800 mb-1">Invoice Workbench</h1>
            <p className="text-sm text-gray-500">
              Total Invoices: {WORKBENCH_SUMMARY.totalInvoices} · Overdue: {WORKBENCH_SUMMARY.overdue} · Pending Amount {WORKBENCH_SUMMARY.pendingAmount}
            </p>
          </section>

          <InvoiceTable invoices={INVOICES} />
          <ActionHistory items={ACTION_HISTORY} />
        </main>
      </div>
    </div>
  );
}
