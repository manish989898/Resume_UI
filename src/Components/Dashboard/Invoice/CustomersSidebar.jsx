import React from 'react';
import { STATUS_CLASSES } from './invoiceWorkbenchData';

/** Score 1–100: >80 green, 60–80 yellow, <60 red. */
function getStatusFromScore(score) {
  const n = Number(score);
  if (n > 80) return 'green';
  if (n >= 60 && n <= 80) return 'yellow';
  return 'red';
}

/**
 * Left sidebar listing customers with status bar and score badge.
 */
export default function CustomersSidebar({ customers }) {
  return (
    <aside className="w-56 shrink-0">
      <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">
        CUSTOMERS
      </h2>
      <ul className="space-y-1">
        {customers.map((customer) => {
          const status = getStatusFromScore(customer.score);
          const statusStyles = STATUS_CLASSES[status] || STATUS_CLASSES.green;
          return (
            <li
              key={customer.id}
              className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-gray-50 cursor-pointer group"
            >
              <span className={`w-1 h-10 rounded-full shrink-0 ${statusStyles.bar}`} aria-hidden />
              <span className="flex-1 text-sm font-medium text-gray-800 truncate min-w-0">
                {customer.name}
              </span>
              <span
                className={`shrink-0 px-2 py-0.5 rounded text-xs font-semibold ${statusStyles.badge}`}
              >
                {customer.score}
              </span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
