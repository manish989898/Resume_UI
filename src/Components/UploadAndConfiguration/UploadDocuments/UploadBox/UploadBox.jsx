import React from 'react';
import UploadProgress from './UploadProgress';
import UploadFailed from './UploadFailed';
import UploadPreviewAnalysis from '../PreviewAndAnalysis/UploadPreviewAnalysis';
import UploadSuccess from './UploadSuccess';

export default function UploadBox({
  isDragging,
  uploadProgress,
  handleFileChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleUpload,
  removeFile,
  selectedFiles,
  uploadStatus,
  validationErrors,
  resetUpload
}) {
  return (
    <>
      {validationErrors.length > 0 && (
        <UploadFailed 
          validationErrors={validationErrors} 
          uploadStatus={uploadStatus} 
          resetUpload={resetUpload} 
        />
      )}

      <div 
        className={`border-2 ${isDragging ? 'border-solid border-[#1B61AD]' : 'border-dashed border-[#1B61AD]'} bg-[#e8eff7] p-10 rounded-xl text-center`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedFiles.length === 0 || uploadStatus === 'failed' ? (
          <>
            <div className="text-4xl mb-4">📤</div>
            <p className="text-lg text-gray-700 mb-8">
              <strong className="text-lg text-[#1B61AD]">Choose a file or drag & drop here.</strong><br />
              JPG, PNG, PDF or Excel formats up to 50MB.
            </p>
            <label className="mt-6 px-6 py-3 bg-[#1B61AD] text-white text-xl rounded-lg hover:bg-white hover:text-[#1B61AD] hover:border-2 hover:border-[#1B61AD] transition duration-300 cursor-pointer">
              Browse File
              <input 
                type="file" 
                className="hidden" 
                multiple 
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.xls,.xlsx"
              />
            </label>
          </>
        ) : (
          <div className="text-left">
            <UploadPreviewAnalysis 
              selectedFiles={selectedFiles} 
              removeFile={removeFile} 
              uploadStatus={uploadStatus} 
              handleUpload={handleUpload} 
              resetUpload={resetUpload} 
            />
            
            {uploadStatus === 'loading' && (
              <UploadProgress uploadProgress={uploadProgress} />
            )}
            
            {uploadStatus === 'succeeded' && (
              <UploadSuccess resetUpload={resetUpload} />
            )}
          </div>
        )}
      </div>
    </>
  );
}