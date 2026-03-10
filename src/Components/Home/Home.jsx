import React, { useState } from 'react';

const MOCK_MATCHES = [
  { name: 'John Doe', score: 88 },
  { name: 'Sarah Johnson', score: 82 },
  { name: 'Michael Lee', score: 76 },
];

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    // Placeholder for search logic
  };

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

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          {/* Find Matching Resumes section */}
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
                  accept=".pdf,.doc,.docx,.md"
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
                  <p className="text-gray-400 text-xs mt-1">PDF, DOC, DOCX, TXT</p>
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
                  className="px-8 py-2.5 bg-[#1B61AD] text-white font-medium rounded-md hover:bg-[#1557a0] transition-colors"
                >
                  Search Matches
                </button>
              </div>
            </form>
          </section>

          {/* Matched Resumes section */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Matched Resumes</h2>
            <p className="text-sm text-gray-500 mb-6">
              Top matching resumes with confidence score &gt; 50%:
            </p>
            <ul className="space-y-4">
              {MOCK_MATCHES.map((match) => (
                <li
                  key={match.name}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-md"
                >
                  <div>
                    <p className="font-medium text-gray-900">{match.name}</p>
                    <a
                      href="#"
                      className="text-[#1B61AD] text-sm hover:underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      View Resume
                    </a>
                  </div>
                  <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded">
                    {match.score}%
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
    </div>
  );
}
