import React, { useState } from 'react';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { searchByQuery, clearQueryResults } from '../../reduxToolkit/slices/ResumeSlices/query';
import { searchByFile, clearFileResults } from '../../reduxToolkit/slices/ResumeSlices/uploadJobDescription';

export default function Home() {
  const dispatch = useDispatch();

  // ── Local UI state (unchanged) ──
  const [jobDescription, setJobDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef(null);

  // ── Redux state ──
  // Active mode: 'text' or 'file' — determines which slice result to show
  const [searchMode, setSearchMode] = useState(null);

  const queryState = useSelector((state) => state.resumeQuery);
  const fileState  = useSelector((state) => state.resumeFileSearch);

  // Pick the active slice based on last search mode
  const active = searchMode === 'file' ? fileState : queryState;
  const { results, totalEvaluated, topNRequested, loading, error } = active;

  // ── Form handlers (unchanged) ──
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files || []);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Search handler ──
  // Priority: files uploaded → file search; else text query
  const handleSearch = (e) => {
    e.preventDefault();

    if (files.length > 0) {
      // Use the first file only (matches API: single file upload)
      setSearchMode('file');
      dispatch(clearQueryResults());
      dispatch(searchByFile({ file: files[0] }));
    } else if (jobDescription.trim()) {
      setSearchMode('text');
      dispatch(clearFileResults());
      dispatch(searchByQuery({ query: jobDescription.trim() }));
    }
  };

  // ── Score colour helper (matches existing green badge style) ──
  const scoreColor = (score) => {
    if (score >= 0.75) return 'bg-green-500';
    if (score >= 0.50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  // Build a file:// URI from the Windows path returned by the API
  const toFileUri = (filePath) =>
    'file:///' + (filePath || '').replace(/\\/g, '/');

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">

        {/* ── Find Matching Resumes section (UI unchanged) ── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Find Matching Resumes</h2>
          <form onSubmit={handleSearch}>
            <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Enter the job description here..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B61AD] focus:border-transparent resize-y"
            />

            {/* Upload option */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or upload file(s)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.md"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-[#1B61AD] bg-[#1B61AD]/5'
                    : 'border-gray-300 hover:border-[#1B61AD] hover:bg-gray-50'
                }`}
              >
                <p className="text-gray-500 text-sm">
                  Drag and drop files here, or <span className="text-[#1B61AD] font-medium">browse</span> to upload
                </p>
                <p className="text-gray-400 text-xs mt-1">PDF, DOCX, MD</p>
              </div>
              {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between text-sm bg-gray-50 rounded px-3 py-2"
                    >
                      <span className="text-gray-700 truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 ml-2 shrink-0"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 flex justify-center">
              <button
                type="submit"
                disabled={loading || (!jobDescription.trim() && files.length === 0)}
                className="px-8 py-2.5 bg-[#1B61AD] text-white font-medium rounded-md hover:bg-[#1557a0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching…' : 'Search Matches'}
              </button>
            </div>
          </form>
        </section>

        {/* ── Error ── */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center gap-2">
            <span className="text-red-500">⚠</span>
            {error}
          </div>
        )}

        {/* ── Matched Resumes section (UI unchanged, data from Redux) ── */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Matched Resumes</h2>
          <p className="text-sm text-gray-500 mb-6">
            {results.length > 0
              ? `Top ${results.length} of ${totalEvaluated} evaluated resume(s) — top ${topNRequested} requested:`
              : 'Top matching resumes with confidence score > 50%:'}
          </p>

          {/* Loading skeleton */}
          {loading && (
            <ul className="space-y-4">
              {[1, 2, 3].map((i) => (
                <li key={i} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-md animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-100 rounded" />
                  </div>
                  <div className="h-7 w-14 bg-gray-200 rounded" />
                </li>
              ))}
            </ul>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <ul className="space-y-4">
              {results.map((match) => {
                const scorePercent = Math.round(match.confidence_score * 100);
                return (
                  <li
                    key={match.rank}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-md"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{match.file_name}</p>
                      <a
                        href={toFileUri(match.file_path)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#1B61AD] text-sm hover:underline"
                        title={match.file_path}
                      >
                        View Resume
                      </a>
                      {match.reasoning && (
                        <p className="text-xs text-gray-500 mt-1 max-w-lg">{match.reasoning}</p>
                      )}
                      {match.matched_keywords?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {match.matched_keywords.slice(0, 6).map((kw) => (
                            <span
                              key={kw}
                              className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-0.5"
                            >
                              {kw}
                            </span>
                          ))}
                          {match.matched_keywords.length > 6 && (
                            <span className="text-xs text-gray-400">
                              +{match.matched_keywords.length - 6} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className={`px-3 py-1 ${scoreColor(match.confidence_score)} text-white text-sm font-medium rounded shrink-0 ml-4`}>
                      {scorePercent}%
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Empty state after a search */}
          {!loading && searchMode && results.length === 0 && !error && (
            <p className="text-sm text-gray-500 text-center py-8">No matching resumes found.</p>
          )}
        </section>
      </div>
    </div>
  );
}
