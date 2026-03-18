import { useState } from 'react'

// Components
import MismatchReview from './MismatchReview/MismatchReview'
import EmailDraftReview from './EmailDraftReview/EmailDraftReview';

export default function Review() {


  const [activeTab, setActiveTab] = useState("Mismatch Review");
  
    const sidebarItems = [
      { label: "Mismatch Review" },
      { label: "Email Draft Review" },
    ];
  
    const renderItemContent = () => {
      switch (activeTab) {
        case "Mismatch Review":
          return <MismatchReview />;
        case "Email Draft Review":
          return <EmailDraftReview />  
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
    <aside className="w-64 bg-white p-6 border-l border-r border-gray-200">
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
    <main className="flex-1 p-6 overflow-auto">
      {renderItemContent()}
    </main>
  </div>
);
  
}
