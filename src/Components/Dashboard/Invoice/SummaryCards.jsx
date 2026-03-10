import React from 'react';

/**
 * Five metric cards: Promise to Pay, Escalations, Disputes, Fully Paid, Partially Paid.
 */
export default function SummaryCards({ cards }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-white rounded-lg shadow border-l-4 ${card.borderColor} p-4 flex flex-col`}
        >
          <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-1">
            {card.label}
          </p>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            {card.sublabel}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-auto">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
