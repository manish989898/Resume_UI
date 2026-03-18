// src/components/InvoiceProcessingMetrics/InvoiceProcessingMetrics.jsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  FaFileInvoice,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUserCheck,
  FaUserEdit,
  FaClipboardCheck,
  FaPaperPlane,
} from 'react-icons/fa';
import { TbRobot } from 'react-icons/tb';
import { LANGUAGE_OPTIONS, getTranslations } from './invoiceProcessingMetricsTranslations';
import MismatchDetailsModal from './MismatchDetailsModal';
import HumanVerificationReviewModal from './HumanVerificationReviewModal';

const BUSINESS_OPTIONS = [
  { value: 'all', label: 'All Businesses' },
  { value: 'business1', label: 'Business 1' },
  { value: 'business2', label: 'Business 2' },
];

export default function InvoiceProcessingMetrics() {
  const [business, setBusiness] = useState(BUSINESS_OPTIONS[0].value);
  const [language, setLanguage] = useState('en');
  const t = useMemo(() => getTranslations(language), [language]);

  const [metrics, setMetrics] = useState({
    invoicesProcessed: null,
    mismatchCount: null,
    invoicesDelivered: null,
    aiAgentFixed: null,
    humanVerification: null,
    humanFix: null,
    invoicesFixedFinal: null,
    sentAfterCorrection: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mismatchModalOpen, setMismatchModalOpen] = useState(false);
  const [humanVerificationModalOpen, setHumanVerificationModalOpen] = useState(false);

  // Fetch all metrics with proper error handling
useEffect(() => {
  const fetchProcessingMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://arsync.online/billbridge/api/invoice-processing-metrics');
      const data = await response.json();

      setMetrics(data);

    } catch (err) {
      console.error('Error fetching processing metrics:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  fetchProcessingMetrics();
}, []);


  // Format values for display
  const formatValue = (value) => {
    if (loading) return t.loading;
    if (error) return t.error;
    if (value === null || value === undefined) return t.na;
    if (typeof value === 'number') return value.toLocaleString();
    return value;
  };

  // Calculate percentages for insights
  const calculatePercentage = (numerator, denominator) => {
    if (!denominator || denominator === 0 || typeof numerator !== 'number' || typeof denominator !== 'number') return 0;
    return Math.round((numerator / denominator) * 100);
  };

  // CORRECT PERCENTAGE CALCULATIONS:
  
  // 1. Mismatch Rate = (Mismatch Count / Invoices Processed) * 100
  const mismatchRate = calculatePercentage(metrics.mismatchCount, metrics.invoicesProcessed);
  
  // 2. AI Fix Rate = (AI Agent Fixed / Mismatch Count) * 100
  const aiFixRate = calculatePercentage(metrics.aiAgentFixed, metrics.mismatchCount);
  
  // 3. Human Fix Rate = (Human Fix / Human Verification) * 100
  const humanFixRate = calculatePercentage(metrics.humanFix, metrics.humanVerification);
  
  // 4. Human Verification Rate = (Human Verification / Mismatch Count) * 100
  const humanVerificationRate = calculatePercentage(metrics.humanVerification, metrics.mismatchCount);
  
  // 5. Final Success Rate = (Invoices Delivered / Invoices Processed) * 100
  const finalSuccessRate = calculatePercentage(metrics.invoicesDelivered, metrics.invoicesProcessed);
  
  // 6. Correction Success Rate = (Sent After Correction / Invoices Fixed Final) * 100
  const correctionSuccessRate = calculatePercentage(metrics.sentAfterCorrection, metrics.mismatchCount);
  
  // 7. Total Fix Rate = (Invoices Fixed Final / Mismatch Count) * 100
  const totalFixRate = calculatePercentage(metrics.invoicesFixedFinal, metrics.mismatchCount);
  
  // 8. Perfect Invoice Rate = ((Invoices Processed - Mismatch Count) / Invoices Processed) * 100
  const perfectInvoiceRate = calculatePercentage(
    metrics.invoicesProcessed - metrics.mismatchCount, 
    metrics.invoicesProcessed
  );

  // Define the 8 processing cards (titles/descriptions from translations)
  const processingCards = useMemo(() => [
    {
      title: t.invoicesProcessed,
      value: formatValue(metrics.invoicesProcessed),
      icon: <FaFileInvoice className="text-3xl text-blue-500" />,
      color: "from-blue-50 to-blue-100",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      description: t.invoicesProcessedDesc,
    },
    {
      title: t.mismatchCount,
      value: formatValue(metrics.mismatchCount),
      icon: <FaExclamationTriangle className="text-3xl text-red-500" />,
      color: "from-red-50 to-red-100",
      textColor: "text-red-700",
      borderColor: "border-red-200",
      description: t.mismatchCountDesc,
      percentage: `${mismatchRate}% ${t.mismatchRateLabel}`,
    },
    {
      title: t.invoicesDelivered,
      value: formatValue(metrics.invoicesDelivered),
      icon: <FaCheckCircle className="text-3xl text-green-500" />,
      color: "from-green-50 to-green-100",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      description: t.invoicesDeliveredDesc,
      percentage: `${finalSuccessRate}% ${t.successRate}`,
    },
    {
      title: t.aiAgentFixed,
      value: formatValue(metrics.aiAgentFixed),
      icon: <TbRobot className="text-3xl text-teal-500" />,
      color: "from-teal-50 to-teal-100",
      textColor: "text-teal-700",
      borderColor: "border-teal-200",
      description: t.aiAgentFixedDesc,
      percentage: `${aiFixRate}% ${t.ofMismatches}`,
    },
    {
      title: t.humanVerification,
      value: formatValue(metrics.humanVerification),
      icon: <FaUserCheck className="text-3xl text-orange-400" />,
      color: "from-orange-100 to-orange-200",
      textColor: "text-orange-600",
      borderColor: "border-orange-300",
      description: t.humanVerificationDesc,
      percentage: `${humanVerificationRate}% ${t.ofMismatches}`,
    },
    {
      title: t.humanFix,
      value: formatValue(metrics.humanFix),
      icon: <FaUserEdit className="text-3xl text-orange-400" />,
      color: "from-orange-100 to-orange-200",
      textColor: "text-orange-600",
      borderColor: "border-orange-300",
      description: t.humanFixDesc,
      percentage: `${humanFixRate}% ${t.ofVerifications}`,
    },
    {
      title: t.invoicesFixedFinal,
      value: formatValue(metrics.invoicesFixedFinal),
      icon: <FaClipboardCheck className="text-3xl text-indigo-500" />,
      color: "from-indigo-50 to-indigo-100",
      textColor: "text-indigo-700",
      borderColor: "border-indigo-200",
      description: t.invoicesFixedFinalDesc,
      percentage: `${totalFixRate}% ${t.ofMismatches}`,
    },
    {
      title: t.sentAfterCorrection,
      value: formatValue(metrics.sentAfterCorrection),
      icon: <FaPaperPlane className="text-3xl text-green-500" />,
      color: "from-green-50 to-green-100",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      description: t.sentAfterCorrectionDesc,
      percentage: `${correctionSuccessRate}% ${t.ofFixed}`,
    },
  ], [t, metrics, mismatchRate, finalSuccessRate, aiFixRate, humanVerificationRate, humanFixRate, totalFixRate, correctionSuccessRate, loading, error]);

  // Calculate summary metrics
  const totalResolved = metrics.invoicesFixedFinal || 0;
  const resolutionRate = calculatePercentage(totalResolved, metrics.mismatchCount);
  const automationEfficiency = calculatePercentage(metrics.aiAgentFixed, metrics.mismatchCount);
  const humanInterventionRate = calculatePercentage(metrics.humanVerification, metrics.mismatchCount);

  return (
    <div className="w-full px-2 md:px-0">
      {/* Page Header: title left, Business + Language dropdowns right */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.pageTitle}</h1>
          <p className="text-gray-600">
            {t.pageSubtitle}
            {metrics.updatedAt && (
              <span className="text-sm text-gray-500 ml-2">
                • {t.lastUpdated} {new Date(metrics.updatedAt).toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <label htmlFor="business-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              {t.business}:
            </label>
            <select
              id="business-select"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-[#1B61AD] focus:outline-none focus:ring-1 focus:ring-[#1B61AD] min-w-[140px]"
            >
              {BUSINESS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="language-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              {t.languageLabel}:
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-[#1B61AD] focus:outline-none focus:ring-1 focus:ring-[#1B61AD] min-w-[140px]"
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{t.errorMessage}</p>
        </div>
      )}

      {/* Single Grid with 8 Cards */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-700 tracking-wide">
            {t.processingMetrics}
          </h2>
          <div className="text-sm text-gray-500">
            {t.perfectInvoices}: {perfectInvoiceRate}% • {t.mismatchRate}: {mismatchRate}%
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processingCards.map((card, index) => (
            <div
              key={index}
              role={index === 1 || index === 4 ? 'button' : undefined}
              tabIndex={index === 1 || index === 4 ? 0 : undefined}
              onClick={index === 1 ? () => setMismatchModalOpen(true) : index === 4 ? () => setHumanVerificationModalOpen(true) : undefined}
              onKeyDown={index === 1 ? (e) => e.key === 'Enter' && setMismatchModalOpen(true) : index === 4 ? (e) => e.key === 'Enter' && setHumanVerificationModalOpen(true) : undefined}
              className={`bg-gradient-to-br ${card.color} p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-center min-h-[180px] border ${card.borderColor} ${index === 1 ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2' : index === 4 ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2' : ''}`}
            >
              <div className="mb-3">{card.icon}</div>
              <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider text-center">
                {card.title}
              </p>
              <p className={`text-2xl font-extrabold ${card.textColor} mb-1`}>
                {card.value}
              </p>
              {card.percentage && (
                <p className="text-xs font-medium mt-2 px-2 py-1 bg-white bg-opacity-50 rounded-full">
                  {card.percentage}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Performance Summary */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">{t.performanceSummary}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{t.resolutionRate}</p>
                  <p className="text-2xl font-bold text-gray-800">{resolutionRate}%</p>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${resolutionRate > 85 ? 'bg-green-100' : resolutionRate > 70 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                  <span className={`text-lg font-bold ${resolutionRate > 85 ? 'text-green-600' : resolutionRate > 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {resolutionRate}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {resolutionRate > 85 ? t.excellent : resolutionRate > 70 ? t.good : t.needsImprovement}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{t.automationEfficiency}</p>
                  <p className="text-2xl font-bold text-gray-800">{automationEfficiency}%</p>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${automationEfficiency > 60 ? 'bg-green-100' : automationEfficiency > 40 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                  <span className={`text-lg font-bold ${automationEfficiency > 60 ? 'text-green-600' : automationEfficiency > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {automationEfficiency}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {automationEfficiency > 60 ? t.highlyAutomated : automationEfficiency > 40 ? t.moderatelyAutomated : t.mostlyManual}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{t.humanIntervention}</p>
                  <p className="text-2xl font-bold text-gray-800">{humanInterventionRate}%</p>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${humanInterventionRate < 20 ? 'bg-green-100' : humanInterventionRate < 40 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                  <span className={`text-lg font-bold ${humanInterventionRate < 20 ? 'text-green-600' : humanInterventionRate < 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {humanInterventionRate}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {humanInterventionRate < 20 ? t.lowManualWork : humanInterventionRate < 40 ? t.moderateManualWork : t.highManualWork}
              </p>
            </div>
          </div>
        </div>
      </div>

      <MismatchDetailsModal
        isOpen={mismatchModalOpen}
        onClose={() => setMismatchModalOpen(false)}
      />
      <HumanVerificationReviewModal
        isOpen={humanVerificationModalOpen}
        onClose={() => setHumanVerificationModalOpen(false)}
      />

      {/* Data Relationships Visualization */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{t.dataRelationships}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-1/3">
              <p className="text-sm text-gray-600">{t.totalProcessed}: {metrics.invoicesProcessed}</p>
              <div className="h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="w-1/3">
              <p className="text-sm text-gray-600">{t.perfectInvoicesCount}: {metrics.invoicesProcessed - metrics.mismatchCount} ({perfectInvoiceRate}%)</p>
              <div className="h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${perfectInvoiceRate}%` }}></div>
              </div>
            </div>
            <div className="text-gray-400">+</div>
            <div className="w-1/3">
              <p className="text-sm text-gray-600">{t.withMismatches}: {metrics.mismatchCount} ({mismatchRate}%)</p>
              <div className="h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${mismatchRate}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div className="w-1/2">
              <p className="text-sm text-gray-600">{t.aiFixed}: {metrics.aiAgentFixed} ({aiFixRate}%)</p>
              <div className="h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-teal-500" style={{ width: `${aiFixRate}%` }}></div>
              </div>
            </div>
            <div className="text-gray-400">+</div>
            <div className="w-1/2">
              <p className="text-sm text-gray-600">{t.humanVerified}: {metrics.humanVerification} ({humanVerificationRate}%)</p>
              <div className="h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-orange-400" style={{ width: `${humanVerificationRate}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend and Definitions */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{t.metricsLegend}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {processingCards.map((card, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="mt-1">{card.icon}</div>
              <div>
                <p className="font-medium text-gray-800">{card.title}</p>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}