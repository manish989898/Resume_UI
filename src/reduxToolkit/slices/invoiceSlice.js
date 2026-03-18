import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for loading mismatch review invoices
export const fetchMismatchInvoices = createAsyncThunk(
  'invoices/fetchMismatchInvoices',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        'https://arsync.online/billbridge/api/mismatch-review',
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        }
      );

      const normalizedInvoices = Array.isArray(response.data)
        ? response.data.map((item) => ({
            id: item.id ?? null,
            invoiceId: item['invoice id'] ?? item.invoiceId ?? 'N/A',
            issueCount: item['issue count'] ?? item.issueCount ?? 0,
            vendor: item.name ?? item.vendor ?? 'N/A',
            name: item.name ?? 'N/A',
            invoiceFileName: item['Invoice File Name'] ?? item.invoiceFileName ?? 'N/A',
            compareDocumentType: item['Compare Document Type'] ?? item.compareDocumentType ?? 'N/A',
            compareDocumentName: item['Compare Document Name'] ?? item.compareDocumentName ?? 'N/A',
            comments: item['Comments'] ?? item.comments ?? 'N/A',
          }))
        : [];

      return normalizedInvoices;
    } catch (error) {
      console.error('Fetch mismatch invoices error:', error);
      return rejectWithValue('Failed to load mismatch invoices');
    }
  }
);

// Async thunk for file upload
export const uploadFile = createAsyncThunk(
  'invoices/uploadFile',
  async (file, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        'https://arsync.online/billbridge/user/upload-global',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            // Progress is handled via the setUploadProgress action
          }
        }
      );

      console.log('Upload File Data',response.data)
      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      return rejectWithValue(
        'File upload failed'
      );
    }
  }
);

const initialState = {
  invoices: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  mismatchStatus: 'idle',
  mismatchError: null,
  selectedInvoice: null,
  uploadProgress: 0,
  uploadError: null,
  uploadSuccess: false,
  currentUploads: []
};

export const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    approveInvoice: (state, action) => {
      const { invoiceId } = action.payload;
      // In a real app, you would update the status of the invoice
      console.log(`Invoice ${invoiceId} approved`);
    },
    rejectInvoice: (state, action) => {
      const { invoiceId } = action.payload;
      // In a real app, you would update the status of the invoice
      console.log(`Invoice ${invoiceId} rejected`);
    },
    newInvoice: (state, action) => {
      state.invoices.unshift(action.payload);
    },
    selectInvoice: (state, action) => {
      state.selectedInvoice = action.payload;
    },
    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null;
    },
    resetUploadState: (state) => {
      state.uploadProgress = 0;
      state.uploadError = null;
      state.uploadSuccess = false;
      state.currentUploads = [];
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    addCurrentUpload: (state, action) => {
      state.currentUploads.push(action.payload);
    },
    removeCurrentUpload: (state, action) => {
      state.currentUploads = state.currentUploads.filter(
        file => file.name !== action.payload.name
      );
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch mismatch invoices cases
      .addCase(fetchMismatchInvoices.pending, (state) => {
        state.mismatchStatus = 'loading';
        state.mismatchError = null;
      })
      .addCase(fetchMismatchInvoices.fulfilled, (state, action) => {
        state.mismatchStatus = 'succeeded';
        state.invoices = action.payload;
      })
      .addCase(fetchMismatchInvoices.rejected, (state, action) => {
        state.mismatchStatus = 'failed';
        state.mismatchError = action.payload || 'Unknown error';
      })
      // Upload File Cases
      .addCase(uploadFile.pending, (state) => {
        state.status = 'loading';
        state.uploadError = null;
        state.uploadSuccess = false;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.uploadSuccess = true;
        state.invoices.unshift(action.payload);
        state.uploadProgress = 100;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.status = 'failed';
        state.uploadError = action.payload;
        state.uploadProgress = 0;
      });
  }
});

// Action creators
export const { 
  approveInvoice,
  rejectInvoice,
  newInvoice,
  selectInvoice,
  clearSelectedInvoice,
  resetUploadState,
  setUploadProgress,
  addCurrentUpload,
  removeCurrentUpload
} = invoicesSlice.actions;

// Selectors
export const selectAllInvoices = (state) => state.invoices.invoices;
export const selectSelectedInvoice = (state) => state.invoices.selectedInvoice;
export const selectUploadStatus = (state) => state.invoices.status;
export const selectMismatchStatus = (state) => state.invoices.mismatchStatus;
export const selectUploadProgress = (state) => state.invoices.uploadProgress;
export const selectUploadError = (state) => state.invoices.uploadError;
export const selectUploadSuccess = (state) => state.invoices.uploadSuccess;
export const selectCurrentUploads = (state) => state.invoices.currentUploads;

export default invoicesSlice.reducer;