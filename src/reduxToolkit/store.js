import { configureStore } from '@reduxjs/toolkit';
import invoicesReducer from './slices/invoiceSlice';
import transactionReducer from './slices/transactionSlice';
import authReducer from './slices/authSlice';
import resumeQueryReducer from './slices/ResumeSlices/query';
import resumeFileSearchReducer from './slices/ResumeSlices/uploadJobDescription';

export const store = configureStore({
  reducer: {
    invoices: invoicesReducer,
    transactions: transactionReducer,
    auth: authReducer,
    resumeQuery: resumeQueryReducer,
    resumeFileSearch: resumeFileSearchReducer,
  },
});