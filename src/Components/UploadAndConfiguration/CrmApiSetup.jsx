import React, { useState } from "react";

const crmData = [
  {
    id: 1,
    name: "Monday.com",
    description: "Streamline workflows, gain clear visibility across teams.",
    connected: true,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 48 48">
        <circle cx="10" cy="10" r="6" fill="#F44336" />
        <circle cx="24" cy="10" r="6" fill="#FFEB3B" />
        <circle cx="38" cy="10" r="6" fill="#4CAF50" />
      </svg>
    ),
  },
  {
    id: 2,
    name: "Zoho CRM",
    description: "Close more deals, build lasting customer relationships.",
    connected: true,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 48 48">
        <rect x="8" y="8" width="32" height="32" rx="4" fill="#FF9800" />
      </svg>
    ),
  },
  {
    id: 3,
    name: "SAP",
    description: "From analyst reports to free trial software, SAP Community and more.",
    connected: true,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="18" fill="#2196F3" />
      </svg>
    ),
  },
  {
    id: 4,
    name: "Salesforce",
    description: "Unite marketing, sales, and service in a single app.",
    connected: false,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 48 48">
        <rect x="12" y="12" width="24" height="24" fill="#03A9F4" />
      </svg>
    ),
  },
  {
    id: 5,
    name: "Pipedrive",
    description: "Track your sales pipeline, optimize leads, manage deals with AI.",
    connected: false,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 48 48">
        <rect x="8" y="8" width="32" height="32" fill="#4CAF50" />
      </svg>
    ),
  },
  {
    id: 6,
    name: "Slack",
    description: "Modern sales CRM frees you to maximize productivity.",
    connected: false,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="12" fill="#9C27B0" />
      </svg>
    ),
  },
];

export default function CrmApiSetup() {
  const [selected, setSelected] = useState(crmData[0]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-semibold">CRM API Setup</h1>
        <p className="text-gray-500">Plug BillBridge AI into your sales and procurement stack.</p>
      </div>

      <div className="flex flex-wrap gap-6">
        {crmData.map((crm) => (
          <div
            key={crm.id}
            className={`w-64 border rounded-xl p-4 shadow-sm cursor-pointer ${
              crm.connected ? "bg-white border-blue-400" : "bg-white"
            }`}
            onClick={() => setSelected(crm)}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                {crm.icon}
                <span className="font-medium">{crm.name}</span>
              </div>
              {crm.connected && (
                <svg className="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0L3.293 10.707a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">{crm.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <button className="text-sm text-gray-600 border border-gray-300 rounded px-2 py-1">
                Setting
              </button>
              {crm.connected ? (
                <button className="text-white bg-red-500 rounded px-3 py-1 text-sm">
                  Disconnect
                </button>
              ) : (
                <button className="text-white bg-blue-500 rounded px-3 py-1 text-sm">
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add new button */}
        <button className="w-64 border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center text-blue-600 hover:bg-blue-50">
          + Add new
        </button>
      </div>

      {/* Integration Settings Panel */}
      {selected && (
        <div className="w-full max-w-md bg-white p-6 border rounded-xl shadow">
          <div className="flex items-center gap-2 mb-2">
            {selected.icon}
            <h2 className="font-medium">{selected.name}</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">{selected.description}</p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Account Name</label>
              <input
                type="text"
                value="Sukanta Besra"
                className="w-full mt-1 border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">API Key</label>
              <input
                type="text"
                value="1231-2345G5678F-G"
                className="w-full mt-1 border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Workspace URL</label>
              <input
                type="text"
                value="https://codeUI@uiux.com"
                className="w-full mt-1 border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button className="bg-red-500 text-white px-4 py-2 rounded">Disconnect</button>
            <button className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
