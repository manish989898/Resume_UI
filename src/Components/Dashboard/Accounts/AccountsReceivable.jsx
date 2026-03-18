import React from 'react';
import ARSummaryCards from './ARSummaryCards';
import UnpaidByCustomerCharts from './UnpaidByCustomerCharts';
import { SUMMARY_CARDS } from './accountsReceivableData';

/**
 * Accounts Receivable page: summary cards and unpaid-by-customer charts.
 */
export default function AccountsReceivable() {
  return (
    <div className="w-full min-h-[calc(100vh-8rem)]">
      <ARSummaryCards cards={SUMMARY_CARDS} />
      <UnpaidByCustomerCharts />
    </div>
  );
}
