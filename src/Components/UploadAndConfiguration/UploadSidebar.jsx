import { useState } from "react";

// Components
import UploadDocument from "./UploadDocuments/UploadDocument";
import LinkDrive from "./LinkDrive";
import EmailDb from "./EmailDb";
import CrmApiSetup from "./CrmApiSetup";
import ProcessSchedule from "./ProcessSchedule";

function QuickbooksForm() {
  const [form, setForm] = useState({
    client_id: "",
    client_secret: "",
    realm_id: "",
    callback_url: "",
  });
  const [modal, setModal] = useState({ open: false, message: "", success: false });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!form.client_id || !form.client_secret || !form.realm_id || !form.callback_url) {
      setModal({ open: true, message: "All fields are required.", success: false });
      return;
    }
    // Get email from localStorage/sessionStorage
    const email = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    if (!email) {
      setModal({ open: true, message: "User email not found in session. Please login again.", success: false });
      return;
    }
    // Send to backend
    try {
      const res = await fetch('http://localhost:7000/billbridge/api/quickbook-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setModal({ open: true, message: data.message, success: true });
      } else {
        setModal({ open: true, message: data.error || "Something went wrong.", success: false });
      }
    } catch {
      setModal({ open: true, message: "Network error. Please try again.", success: false });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-2">
      <div className="w-full max-w-md bg-gradient-to-br from-blue-100 via-white to-purple-100 rounded-3xl shadow-2xl p-8 border border-blue-200 relative overflow-hidden">
        {/* Decorative background effect */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-200 opacity-30 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-200 opacity-30 rounded-full blur-2xl pointer-events-none"></div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-blue-400 mb-8 tracking-wide drop-shadow-lg">
          <span className="inline-block animate-pulse">Quickbook Connect</span>
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Client ID
            </label>
            <input
              type="text"
              name="client_id"
              value={form.client_id}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none transition bg-white shadow-sm placeholder-gray-400"
              placeholder="Enter your Client ID"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Client Secret
            </label>
            <input
              type="password"
              name="client_secret"
              value={form.client_secret}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-400 focus:outline-none transition bg-white shadow-sm placeholder-gray-400"
              placeholder="Enter your Client Secret"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Realm ID
            </label>
            <input
              type="text"
              name="realm_id"
              value={form.realm_id}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none transition bg-white shadow-sm placeholder-gray-400"
              placeholder="Enter your Realm ID"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Callback URL
            </label>
            <input
              type="text"
              name="callback_url"
              value={form.callback_url}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-400 focus:outline-none transition bg-white shadow-sm placeholder-gray-400"
              placeholder="Enter your Callback URL"
              required
            />
          </div>
          <button
            type="submit"
            style={{ backgroundColor: "#1b61ad" }}
            className="w-full py-3 mt-2 text-white font-bold rounded-xl shadow-xl hover:bg-[#174e8a] hover:scale-105 transition-all duration-200 text-lg tracking-wide"
          >
            <span className="inline-block animate-bounce">Connect</span>
          </button>
        </form>
        {/* Modal */}
        {modal.open && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full text-center relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
                onClick={() => setModal({ ...modal, open: false })}
                aria-label="Close"
              >
                &times;
              </button>
              <div className={`mb-4 text-lg font-semibold ${modal.success ? "text-green-600" : "text-red-600"}`}>
                {modal.message}
              </div>
              <button
                className="mt-2 px-4 py-2 bg-[#1b61ad] text-white rounded hover:bg-[#174e8a] transition"
                onClick={() => setModal({ ...modal, open: false })}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UploadSidebar() {
  const [activeTab, setActiveTab] = useState("Upload Document");

  const sidebarItems = [
    { label: "Upload Document" },
    { label: "Link Google Drive Folder" },
    { label: "Enter Email & DB Credentials" },
    { label: "CRM API Setup" },
    { label: "Configure Payment Gateway" },
    { label: "Enable Slack Notifications" },
    { label: "Configure Reviewer Email Integration" },
    { label: "API Key / Secret Key (for Payments)" },
    { label: "Notification Email for Payment Errors" },
    { label: "Process Schedule" },
    { label: "Quickbooks" }, // <-- add this
  ];

  const renderItemContent = () => {
    switch (activeTab) {
      case "Upload Document":
        return <UploadDocument />;
      case "Link Google Drive Folder":
        return <LinkDrive />;
      case "Enter Email & DB Credentials":
        return <EmailDb />;
      case "CRM API Setup":
        return <CrmApiSetup />;
      case "Process Schedule":
        return <ProcessSchedule />;
      case "Quickbooks":
        return <QuickbooksForm />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 text-lg">
              {activeTab} content coming soon
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-74 bg-white p-6 border-l border-r border-gray-200">
        <ul className="space-y-3">
          {sidebarItems.map((item, index) => (
            <li
              key={index}
              onClick={() => setActiveTab(item.label)}
              className={`px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                activeTab === item.label
                  ? "bg-[#e8eff7] text-[#1B61AD] font-semibold"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">{renderItemContent()}</main>
    </div>
  );
}