import axios from 'axios';

const API_BASE_URL = 'https://arsync.online/billbridge/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// API endpoint mapping for drill-down data
const API_ENDPOINTS = {
  amount_due: '/total-balance-due-details',
  total_balance_due: '/total-balance-due-details',
  invoices_due: '/invoices-due-details',
  number_of_invoices_due: '/invoices-due-details',
  due_over_60_days: '/due-over-60-days-details',
  due_over_30_days: '/due-over-30-days-details',
  less_than_30_days: '/less-than-30-days-details',
  email_reminders_sent: '/email-reminders-sent-details',
  number_of_email_reminders_sent: '/email-reminders-sent-details',
  emails_opened: '/emails-opened-details',
  number_of_emails_opened: '/emails-opened-details',
  replies: '/replies-details',
  number_of_replies: '/replies-details',
  escalations: '/number-of-escalations',
  number_of_escalations: '/number-of-escalations',
  promise_to_pay: '/promise-to-pay-details',
};

/**
 * Fetch drill-down data for a specific metric type
 * @param {string} metricType - The type of metric to fetch details for
 * @returns {Promise<Array>} Array of detailed records
 */
export const fetchDrillDownData = async (metricType) => {
  try {
    const endpoint = API_ENDPOINTS[metricType];
    
    if (!endpoint) {
      throw new Error(`No API endpoint defined for metric type: ${metricType}`);
    }

    const token = getAuthToken();
    const config = {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    };

    const response = await axios.get(`${API_BASE_URL}${endpoint}`, config);

    // Normalize the response data to a consistent format
    if (!Array.isArray(response.data)) {
      // If the API returns an object with a data property
      if (response.data.data && Array.isArray(response.data.data)) {
        return normalizeData(response.data.data, metricType);
      }
      // If the API returns a single object, wrap it in an array
      if (response.data && typeof response.data === 'object') {
        return normalizeData([response.data], metricType);
      }
      return [];
    }

    return normalizeData(response.data, metricType);
  } catch (error) {
    console.error(`Error fetching drill-down data for ${metricType}:`, error);
    
    // If the API endpoint doesn't exist, return mock data for development
    if (error.response?.status === 404) {
      console.warn(`API endpoint not found for ${metricType}, returning mock data`);
      return getMockData(metricType);
    }
    
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch drill-down data'
    );
  }
};

/**
 * Calculate aging bucket based on days overdue or days until due
 * @param {Object} item - Data item
 * @returns {string} Bucket string
 */
const calculateBucket = (item) => {
  const daysOverdue = parseInt(item.daysOverdue || item.days_overdue || item.days || 0);
  const daysUntilDue = parseInt(item.daysUntilDue || item.days_until_due || 0);
  const dueDate = item.dueDate || item.due_date || item['Due Date'];
  
  // If we have days overdue
  if (daysOverdue > 0) {
    if (daysOverdue > 90) return '90+ Days';
    if (daysOverdue > 60) return '61-90 Days';
    if (daysOverdue > 30) return '31-60 Days';
    return '0-30 Days';
  }
  
  // If we have days until due
  if (daysUntilDue > 0) {
    if (daysUntilDue <= 30) return '0-30 Days';
    if (daysUntilDue <= 60) return '31-60 Days';
    if (daysUntilDue <= 90) return '61-90 Days';
    return '90+ Days';
  }
  
  // Try to calculate from due date
  if (dueDate && dueDate !== 'N/A') {
    try {
      const due = new Date(dueDate);
      const today = new Date();
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        // Overdue
        const overdueDays = Math.abs(diffDays);
        if (overdueDays > 90) return '90+ Days';
        if (overdueDays > 60) return '61-90 Days';
        if (overdueDays > 30) return '31-60 Days';
        return '0-30 Days';
      } else {
        // Not yet due
        if (diffDays <= 30) return '0-30 Days';
        if (diffDays <= 60) return '31-60 Days';
        if (diffDays <= 90) return '61-90 Days';
        return '90+ Days';
      }
    } catch (e) {
      return 'N/A';
    }
  }
  
  return 'N/A';
};

/**
 * Normalize API response data to a consistent format
 * @param {Array} data - Raw API response data
 * @param {string} metricType - The metric type for context
 * @returns {Array} Normalized data array
 */
const normalizeData = (data, metricType) => {
  if (!Array.isArray(data)) {
    return [];
  }

  // Special handling for escalations
  if (metricType === 'escalations' || metricType === 'number_of_escalations') {
    return data.map((item, index) => {
      return {
        id: item.id || item._id || index,
        customerName: item.name || item.customerName || item.customer_name || 'N/A',
        invoiceId: item['invoice id'] || item.invoiceId || item.invoice_id || item['Invoice File Name'] || 'N/A',
        invoiceFileName: item['Invoice File Name'] || item.invoiceFileName || item.invoice_file_name || 'N/A',
        issueCount: item['issue count'] || item.issueCount || item.issue_count || 0,
        compareDocumentType: item['Compare Document Type'] || item.compareDocumentType || item.compare_document_type || 'N/A',
        compareDocumentName: item['Compare Document Name'] || item.compareDocumentName || item.compare_document_name || 'N/A',
        comments: item.Comments || item.comments || item.comment || 'N/A',
        status: 'Escalated',
      };
    });
  }

  return data.map((item, index) => {
    // Standard fields for all metric types
    const normalized = {
      id: item.id || item._id || index,
      customerName: item.customerName || item.customer_name || item.name || item.vendor || 'N/A',
      email: item.email || item.Email || item.customer_email || item.customerEmail || 'N/A',
      amountPending: parseFloat(item.amountPending || item.amount_pending || item.amount || item.balance || item.promisedAmount || item.promised_amount || 0),
      dueDate: item.dueDate || item.due_date || item['Due Date'] || item.promisedDate || item.promised_date || item.lastReminderDate || item.last_reminder_date || item.lastOpenedDate || item.last_opened_date || item.lastReplyDate || item.last_reply_date || item.escalationDate || item.escalation_date || 'N/A',
      bucket: item.bucket || item.aging_bucket || item.agingBucket || item['Aging Bucket'] || item['Bucket'] || calculateBucket(item) || 'N/A',
      status: item.status || item.Status || 'Pending',
    };

    return normalized;
  });
};

/**
 * Generate mock data for development/testing when API endpoints don't exist
 * @param {string} metricType - The metric type
 * @returns {Array} Mock data array
 */
const getMockData = (metricType) => {
  const mockCustomers = ['Acme Corp', 'Tech Solutions Inc', 'Global Industries', 'Digital Services LLC', 'Enterprise Systems'];
  const mockStatuses = ['Pending', 'Overdue', 'Paid', 'Processing'];
  
  const count = 10; // Number of mock records
  
  switch (metricType) {
    case 'amount_due':
    case 'total_balance_due':
    case 'invoices_due':
    case 'number_of_invoices_due':
      return Array.from({ length: count }, (_, i) => {
        const dueDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
        return {
          id: i + 1,
          customerName: mockCustomers[i % mockCustomers.length],
          email: `customer${i + 1}@example.com`,
          amountPending: Math.random() * 10000 + 1000,
          dueDate: dueDate.toLocaleDateString(),
          bucket: calculateBucket({ dueDate: dueDate.toLocaleDateString() }),
          status: mockStatuses[i % mockStatuses.length],
        };
      });

    case 'due_over_60_days':
    case 'due_over_30_days':
      return Array.from({ length: count }, (_, i) => {
        const daysOverdue = metricType === 'due_over_60_days' ? Math.floor(Math.random() * 30 + 60) : Math.floor(Math.random() * 30 + 30);
        const dueDate = new Date(Date.now() - daysOverdue * 24 * 60 * 60 * 1000);
        return {
          id: i + 1,
          customerName: mockCustomers[i % mockCustomers.length],
          email: `customer${i + 1}@example.com`,
          amountPending: Math.random() * 10000 + 1000,
          daysOverdue,
          dueDate: dueDate.toLocaleDateString(),
          bucket: calculateBucket({ daysOverdue }),
          status: 'Overdue',
        };
      });

    case 'less_than_30_days':
      return Array.from({ length: count }, (_, i) => {
        const daysUntilDue = Math.floor(Math.random() * 30);
        const dueDate = new Date(Date.now() + daysUntilDue * 24 * 60 * 60 * 1000);
        return {
          id: i + 1,
          customerName: mockCustomers[i % mockCustomers.length],
          email: `customer${i + 1}@example.com`,
          amountPending: Math.random() * 10000 + 1000,
          daysUntilDue,
          dueDate: dueDate.toLocaleDateString(),
          bucket: calculateBucket({ daysUntilDue }),
          status: 'Pending',
        };
      });

    case 'email_reminders_sent':
    case 'number_of_email_reminders_sent':
      return Array.from({ length: count }, (_, i) => {
        const dueDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        return {
          id: i + 1,
          customerName: mockCustomers[i % mockCustomers.length],
          email: `customer${i + 1}@example.com`,
          amountPending: Math.random() * 10000 + 1000,
          dueDate: dueDate.toLocaleDateString(),
          bucket: calculateBucket({ dueDate: dueDate.toLocaleDateString() }),
          reminderCount: Math.floor(Math.random() * 5 + 1),
          lastReminderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          status: 'Sent',
        };
      });

    case 'emails_opened':
    case 'number_of_emails_opened':
      return Array.from({ length: count }, (_, i) => {
        const dueDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        return {
          id: i + 1,
          customerName: mockCustomers[i % mockCustomers.length],
          email: `customer${i + 1}@example.com`,
          amountPending: Math.random() * 10000 + 1000,
          dueDate: dueDate.toLocaleDateString(),
          bucket: calculateBucket({ dueDate: dueDate.toLocaleDateString() }),
          openCount: Math.floor(Math.random() * 10 + 1),
          lastOpenedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          status: 'Opened',
        };
      });

    case 'replies':
    case 'number_of_replies':
      return Array.from({ length: count }, (_, i) => {
        const dueDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        return {
          id: i + 1,
          customerName: mockCustomers[i % mockCustomers.length],
          email: `customer${i + 1}@example.com`,
          amountPending: Math.random() * 10000 + 1000,
          dueDate: dueDate.toLocaleDateString(),
          bucket: calculateBucket({ dueDate: dueDate.toLocaleDateString() }),
          replyCount: Math.floor(Math.random() * 3 + 1),
          lastReplyDate: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          status: 'Replied',
        };
      });

    case 'escalations':
    case 'number_of_escalations':
      return Array.from({ length: count }, (_, i) => {
        const dueDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
        return {
          id: i + 1,
          customerName: mockCustomers[i % mockCustomers.length],
          email: `customer${i + 1}@example.com`,
          amountPending: Math.random() * 10000 + 1000,
          dueDate: dueDate.toLocaleDateString(),
          bucket: calculateBucket({ dueDate: dueDate.toLocaleDateString() }),
          invoiceId: `INV-${String(i + 1).padStart(6, '0')}`,
          escalationReason: ['Payment overdue', 'Dispute', 'Service issue', 'Billing error'][i % 4],
          escalationDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          status: 'Escalated',
        };
      });

    case 'promise_to_pay':
      return Array.from({ length: count }, (_, i) => {
        const dueDate = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000);
        return {
          id: i + 1,
          customerName: mockCustomers[i % mockCustomers.length],
          email: `customer${i + 1}@example.com`,
          amountPending: Math.random() * 10000 + 1000,
          dueDate: dueDate.toLocaleDateString(),
          bucket: calculateBucket({ dueDate: dueDate.toLocaleDateString() }),
          invoiceId: `INV-${String(i + 1).padStart(6, '0')}`,
          promisedAmount: Math.random() * 10000 + 1000,
          promisedDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          status: 'Promised',
        };
      });

    default:
      return Array.from({ length: count }, (_, i) => {
        const dueDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
        return {
          id: i + 1,
          customerName: mockCustomers[i % mockCustomers.length],
          email: `customer${i + 1}@example.com`,
          amountPending: Math.random() * 10000 + 1000,
          dueDate: dueDate.toLocaleDateString(),
          bucket: calculateBucket({ dueDate: dueDate.toLocaleDateString() }),
          status: mockStatuses[i % mockStatuses.length],
        };
      });
  }
};

