import React from 'react';
import EmailAttachmentDisplay from './EmailAttachmentDisplay';
import EmailUploadSend from './EmailUploadSend';
import EmailSuggestions from './EmailSuggestions';

export default function EmailBox({
  formik,
  handleKeyDown,
  handleDelete,
  handleSuggestionClick,
  handleAttachmentClick,
  handleFileChange,
  removeAttachment,
  getFileTypeIcon,
  formatFileSize,
  fileInputRef
}) {
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">From:</label>
              <input
                type="email"
                name="senderEmail"
                value={formik.values.senderEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your email"
                className={`w-full border ${
                  formik.errors.senderEmail && formik.touched.senderEmail ? 'border-red-500' : 'border-gray-200'
                } rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {formik.errors.senderEmail && formik.touched.senderEmail && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.senderEmail}</p>
              )}
            </div>

            <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
            <div className={`flex flex-wrap items-center gap-2 border ${ formik.errors.receiverEmails ? 'border-red-500' : 'border-gray-200'} rounded-md p-1 min-h-10`}>
                {formik.values.receiverEmails.map((email) => (
                  <span 
                    key={email} 
                    className="bg-gray-100 text-sm px-3 py-1 rounded-full inline-flex items-center"
                  >
                    {email}
                    <span 
                      className="ml-2 cursor-pointer hover:text-red-500"
                      onClick={() => handleDelete(email)}
                    >
                      ✕
                    </span>
                  </span>
                ))}
                <input
                  type="text" // Changed from email to text to allow partial input
                  name="emailInput"
                  value={formik.values.emailInput}
                  onChange={formik.handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder={formik.values.receiverEmails.length === 0 ? "Enter recipient emails" : ""}
                  className="flex-1 min-w-[100px] px-2 py-1 text-sm focus:outline-none"
                />
              </div>
              
              {formik.errors.receiverEmails && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.receiverEmails}</p>
              )}
              
              <EmailSuggestions 
                suggestions={formik.values.suggestions} 
                handleSuggestionClick={handleSuggestionClick} 
                emailInput={formik.values.emailInput} 
                receiverEmails={formik.values.receiverEmails} 
                formik={formik}
              />
            </div>

            <div className="text-sm text-blue-600 mt-2 cursor-pointer hover:underline">CC BCC</div>
          </div>

          <div className="border-b border-gray-200 p-4">
            <input
              type="text"
              name='subject'
              placeholder="Subject"
              className="w-full font-semibold text-gray-700 focus:outline-none"
              onChange={formik.handleChange}
              value={formik.values.subject}
            />
          </div>

          <div className="p-4">
            <textarea
              name="emailContent"
              value={formik.values.emailContent}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full h-64 text-sm text-gray-800 focus:outline-none resize-none whitespace-pre-line border ${
                formik.errors.emailContent && formik.touched.emailContent ? 'border-red-500' : 'border-transparent'
              } rounded-md p-2`}
            />
            {formik.errors.emailContent && formik.touched.emailContent && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.emailContent}</p>
            )}
          </div>

          <EmailAttachmentDisplay 
            attachments={formik.values.attachments} 
            removeAttachment={removeAttachment} 
            getFileTypeIcon={getFileTypeIcon} 
            formatFileSize={formatFileSize} 
          />
          
          <EmailUploadSend 
            handleAttachmentClick={handleAttachmentClick} 
            handleFileChange={handleFileChange} 
            fileInputRef={fileInputRef} 
            formik={formik}
          />
        </div>
      </form>

      <div className="mt-4 text-sm text-gray-500">
        <p>Supported attachment types: Contracts (PDF), Invoices (PDF, JPG, PNG), Purchase Orders (PDF, DOCX)</p>
        <p>Maximum total attachment size: 10MB</p>
      </div>
    </>
  );
}