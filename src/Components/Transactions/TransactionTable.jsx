import React from 'react'

export default function TransactionTable({logs,levelColors}) {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="px-6 py-3 font-medium">TIMESTAMP</th>
              <th className="px-6 py-3 font-medium">USER</th>
              <th className="px-6 py-3 font-medium">LEVEL</th>
              <th className="px-6 py-3 font-medium">Message</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log, index) => (
              <tr key={index}>
                <td className="px-6 py-4 text-gray-900">{log.timestamp}</td>
                <td className="px-6 py-4 text-blue-600 hover:underline cursor-pointer">{log.user}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${levelColors[log.level]}`}>
                    {log.level === 'INFO' && 'ℹ️'}
                    {log.level === 'ERROR' && '❗'}
                    {log.level === 'WARNING' && '⚠️'}&nbsp;{log.level}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-800">{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  )
}
