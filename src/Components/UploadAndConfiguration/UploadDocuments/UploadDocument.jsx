import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  uploadFile, 
  resetUploadState,
  setUploadProgress,
  selectUploadProgress,
  selectUploadStatus,
  selectUploadError
} from '../../../reduxToolkit/slices/invoiceSlice';
import UploadBox from './UploadBox/UploadBox';

export default function UploadDocument() {
  const dispatch = useDispatch();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  
  // Get state from Redux
  const uploadProgress = useSelector(selectUploadProgress);
  const uploadStatus = useSelector(selectUploadStatus);
  const uploadError = useSelector(selectUploadError);

  // File validation
  const isValidFileType = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 
                         'application/vnd.ms-excel', 
                         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    return allowedTypes.includes(file.type);
  };

  const isValidFileSize = (file) => file.size <= 50 * 1024 * 1024; // 50MB

  // Process selected files
  const processFiles = (files) => {
    setValidationErrors([]);
    const validFiles = files.filter(file => 
      isValidFileType(file) && isValidFileSize(file)
    );

    if (validFiles.length !== files.length) {
      setValidationErrors(prev => [
        ...prev,
        'Some files were invalid. Only JPG, PNG, PDF or Excel files under 50MB are allowed.'
      ]);
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  // Upload handler
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      // Upload each file sequentially
      for (const file of selectedFiles) {
        await dispatch(uploadFile(file)).unwrap();
      }
    } catch (error) {
      setValidationErrors([error || 'Upload failed']);
    }
  };

  // Remove file from selection
  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  // Reset everything
  const resetUpload = () => {
    setSelectedFiles([]);
    setValidationErrors([]);
    dispatch(resetUploadState());
    window.location.reload()
  };

  return (
    <main className="flex-1 p-10">
      <h2 className="text-2xl font-semibold mb-2">Upload Your Invoices & POs</h2>
      <p className="text-gray-600 mb-4">Drag, drop, and let AI do the heavy lifting.</p>
      <hr className='mb-4 border-gray-200' />

      <UploadBox 
        isDragging={isDragging}
        uploadProgress={uploadProgress}
        handleFileChange={handleFileChange}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        handleUpload={handleUpload}
        removeFile={removeFile}
        selectedFiles={selectedFiles}
        uploadStatus={uploadStatus}
        validationErrors={validationErrors}
        resetUpload={resetUpload}
      />
    </main>
  );
}