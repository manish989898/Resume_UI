/**
 * ResumeSlices/query.js
 *
 * Redux slice for POST /search — text-based job description query.
 *
 * API shape sent:
 *   { query: string, top_n?: number }
 *
 * API response shape (SearchResponse):
 *   {
 *     query: string,
 *     total_resumes_evaluated: number,
 *     top_n_requested: number,
 *     results: [
 *       {
 *         rank: number,
 *         file_name: string,
 *         file_path: string,
 *         confidence_score: number,   // 0.0 – 1.0
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

export const searchByQuery = createAsyncThunk(
  'resumeQuery/search',
  async ({ query, topN = null }, { rejectWithValue }) => {
    try {
      const payload = { query };
      if (topN) payload.top_n = topN;

      const response = await axios.post(`${BASE_URL}/search`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      return response.data;
    } catch (error) {
      const detail =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Search failed. Please try again.';
      return rejectWithValue(detail);
    }
  }
);

// ── Slice ────────────────────────────────────────────────

const querySlice = createSlice({
  name: 'resumeQuery',
  initialState: {
    results: [],               // ResumeMatchResponse[]
    query: '',                 // echoed query string from API
    totalEvaluated: 0,
    topNRequested: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearQueryResults(state) {
      state.results = [];
      state.query = '';
      state.totalEvaluated = 0;
      state.topNRequested = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchByQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchByQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results ?? [];
        state.query = action.payload.query ?? '';
        state.totalEvaluated = action.payload.total_resumes_evaluated ?? 0;
        state.topNRequested = action.payload.top_n_requested ?? 0;
      })
      .addCase(searchByQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearQueryResults } = querySlice.actions;
export default querySlice.reducer;
