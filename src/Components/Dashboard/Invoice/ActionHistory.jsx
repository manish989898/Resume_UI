import React from 'react';
import { FaExclamationTriangle, FaHandshake, FaCheck, FaBell } from 'react-icons/fa';

const ACTION_ICONS = {
  dispute: { Icon: FaExclamationTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  promise: { Icon: FaHandshake, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  paid: { Icon: FaCheck, color: 'text-green-600', bg: 'bg-green-50' },
  reminder: { Icon: FaBell, color: 'text-red-600', bg: 'bg-red-50' },
};

/**
 * List of recent actions with icon and timestamp.
 */
export default function ActionHistory({ items }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Action History</h2>
        <button
          type="button"
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
          aria-label="More options"
        >
          <span className="text-lg">⋯</span>
        </button>
      </div>
      <ul className="divide-y divide-gray-100">
        {items.map((item) => {
          const config = ACTION_ICONS[item.iconType] || ACTION_ICONS.reminder;
          const { Icon, color, bg } = config;
          return (
            <li key={item.id} className="flex items-start gap-3 py-3 first:pt-0">
              <span
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${bg} ${color}`}
              >
                <Icon className="w-4 h-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800">{item.text}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
