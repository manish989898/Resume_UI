/**
 * ResumeSlices/uploadJobDescription.js
 *
 * Redux slice for POST /search/file — file-based job description search.
 * Accepts a single File object (.pdf, .docx, .md, .txt).
 *
 * API response shape (JDSearchResponse extends SearchResponse):
 *   {
 *     query: string,                   // first 300 chars of extracted text
 *     total_resumes_evaluated: number,
 *     top_n_requested: number,
 *     results: [
 *       {
 *         rank: number,
 *         file_name: string,
 *         file_path: string,
 *         confidence_score: number,    // 0.0 – 1.0
 *         reasoning: string,
 *         matched_keywords: string[],
 *         top_rerank_score: number,
 *       }
 *     ]
 *   }
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_RESUME_API_BASE_URL;

// ── Async thunk ──────────────────────────────────────────

export const searchByFile = createAsyncThunk(
  'resumeFileSearch/search',
  async ({ file, topN = null }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('files', file);
      formData.append('file_type', 'jd');
      if (topN) formData.append('top_n', topN);

      const response = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data.uploaded[0].search_results;
    } catch (error) {
      const detail =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'File search failed. Please try again.';
      return rejectWithValue(detail);
    }
  }
);

// ── Slice ────────────────────────────────────────────────

const uploadJobDescriptionSlice = createSlice({
  name: 'resumeFileSearch',
  initialState: {
    results: [],               // ResumeMatchResponse[]
    query: '',                 // extracted text preview from API
    totalEvaluated: 0,
    topNRequested: 0,
    responseTime: null,        // pipeline duration in ms (from API)
    loading: false,
    error: null,
  },
  reducers: {
    clearFileResults(state) {
      state.results = [];
      state.query = '';
      state.totalEvaluated = 0;
      state.topNRequested = 0;
      state.responseTime = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchByFile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.responseTime = null;
      })
      .addCase(searchByFile.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results ?? [];
        state.query = action.payload.query ?? '';
        state.totalEvaluated = action.payload.total_resumes_evaluated ?? 0;
        state.topNRequested = action.payload.top_n_requested ?? 0;
        state.responseTime = action.payload.response_time_ms ?? null;
      })
      .addCase(searchByFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFileResults } = uploadJobDescriptionSlice.actions;
export default uploadJobDescriptionSlice.reducer;
