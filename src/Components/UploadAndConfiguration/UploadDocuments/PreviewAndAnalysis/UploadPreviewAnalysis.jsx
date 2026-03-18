import { useState } from 'react';
import PaperClipIcon from '../../../../assets/icons/PaperClipIcon';
import FilePreview from './FilePreview';

export default function UploadPreviewAnalysis({ 
  selectedFiles, 
  removeFile, 
  uploadStatus, 
  handleUpload,
  resetUpload 
}) {
  const [viewingFile, setViewingFile] = useState(null);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleViewFile = (file) => {
    const url = URL.createObjectURL(file);
    setViewingFile({
      name: file.name,
      url: url,
      type: file.type
    });
  };

  const handleCloseViewer = () => {
    if (viewingFile?.url) {
      URL.revokeObjectURL(viewingFile.url);
    }
    setViewingFile(null);
  };

  return (
    <>
      <h3 className="text-xl font-medium mb-4">Selected Files:</h3>
      <ul className="mb-4 space-y-2">
        {selectedFiles.map((file, index) => (
          <li key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
            <div 
              className="flex items-center gap-2 cursor-pointer flex-1"
              onClick={() => handleViewFile(file)}
            >
              <PaperClipIcon className="text-gray-500" size={16} />
              <span className="truncate max-w-xs">{file.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm whitespace-nowrap">
                {formatFileSize(file.size)}
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="text-red-500 hover:text-red-700 p-1"
                disabled={uploadStatus === 'loading'}
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
      
      {uploadStatus !== 'loading' && selectedFiles.length > 0 && (
        <button 
          onClick={uploadStatus === 'succeeded' ? resetUpload : handleUpload}
          className="mt-4 px-6 py-3 bg-[#1B61AD] text-white text-xl rounded-lg hover:bg-white hover:text-[#1B61AD] hover:border-2 hover:border-[#1B61AD] transition duration-300"
          disabled={uploadStatus === 'loading'}
        >
          {uploadStatus === 'succeeded' ? 'Upload More Files' : 'Upload Files'}
        </button>
      )}

      {viewingFile && (
        <FilePreview 
          viewingFile={viewingFile} 
          handleCloseViewer={handleCloseViewer} 
        />
      )}
    </>
  );
}