import React from 'react';
import PaperClipIcon from '../../../assets/icons/PaperClipIcon';
import DeleteIcon from '../../../assets/icons/DeleteIcon';

export default function EmailUploadSend({
  handleAttachmentClick,
  handleFileChange,
  fileInputRef,
  formik
}) {
  const handleSendClick = (e) => {
    e.preventDefault();
    // Validate all fields before submission
    formik.validateForm().then(errors => {
      if (Object.keys(errors).length === 0) {
        formik.handleSubmit();
      } else {
        // Mark all fields as touched to show errors
        formik.setTouched({
          senderEmail: true,
          receiverEmails: true,
          emailContent: true
        });
      }
    });
  };

  const handleClearDraft = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to clear this draft?')) {
      formik.resetForm();
    }
  };

  return (
    <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
      <div className="flex items-center gap-3">
        <button 
          className="text-gray-500 hover:bg-red-200 rounded-md transition-duration-200 hover:p-2 hover:rounded-full"
          onClick={handleClearDraft}
          disabled={formik.isSubmitting}
        >
          <DeleteIcon size={18} />
        </button>
        <div className="relative">
          <button 
            className="text-gray-500 hover:bg-gray-200 rounded-md transition-duration-200 hover:p-2 hover:rounded-full" 
            onClick={handleAttachmentClick}
            disabled={formik.isSubmitting}
            type="button"
          >
            <PaperClipIcon className="text-gray-500 hover:text-green-600" size={18} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.docx"
            className="hidden"
            disabled={formik.isSubmitting}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button 
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200 disabled:opacity-50"
          disabled={formik.isSubmitting}
          type="button"
        >
          Update Draft
        </button>
        <button 
          className={`bg-[#1B61AD] text-white px-4 py-2 rounded-md text-sm hover:bg-white hover:text-[#1B61AD] border border-[#1B61AD] transition disabled:opacity-50 ${
            formik.isSubmitting ? 'cursor-not-allowed' : ''
          }`}
          onClick={handleSendClick}
          disabled={formik.isSubmitting}
          type="button"
        >
          {formik.isSubmitting ? 'Sending...' : 'Request to Send'}
        </button>
      </div>
    </div>
  );
}