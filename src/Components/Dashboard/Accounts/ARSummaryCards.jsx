import React from 'react';

/**
 * Six summary cards: amount on top, label below. White cards with subtle border/shadow.
 */
export default function ARSummaryCards({ cards }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
        >
          <p className="text-xl font-bold text-gray-900 mb-1">{card.amount}</p>
          <p className="text-sm text-gray-600">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
