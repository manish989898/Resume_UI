import React from 'react';

// Redux
// import { useDispatch } from 'react-redux';
// import { newInvoice } from '../../../reduxToolkit/slices/invoiceSlice';

// Schemas
import { EmailSchema } from '../../../assets/utils/validationSchemas/emailSchema';

// Packages and Libraries
import { useFormik } from 'formik';

// Components
import EmailBox from './EmailBox';


export default function EmailDraftReview() {
  //const dispatch = useDispatch();
  const fileInputRef = React.useRef(null);

  const formik = useFormik({
    initialValues: {
      senderEmail: 'devanshsaxena74@gmail.com',
      receiverEmails: ['client1@example.com', 'client2@example.com'],
      subject: 'Invoice Disrepancy',
      emailInput: '',
      emailContent: `Dear Vendor, Please review the attached invoice #1234578 from Grapco builder for $3200. This invoice  is related to PO2398905 for building material. Please approve this invoice for payment by 12 June, 2025`,
      attachments: [],
      suggestions: ['client1@example.com', 'client2@example.com', 'vendor@example.com','devanshsaxena74@gmail.com']
    },
    validationSchema: EmailSchema,
    onSubmit: (values) => {
      const emailData = {
        vendor: '1234567890', 
        invoiceId: 'INV-000003', 
        issueCount: 1,
        senderEmail: values.senderEmail,
        receiverEmails: values.receiverEmails.join(','),
        subject: values.subject,
        content: values.emailContent,
        attachments: values.attachments.map((ele) => ({
          name: ele.name,
          size: ele.size,
          type: ele.type,
          file: ele.file,
        }))
      };
      
      console.log('Email data:', emailData);
      alert('Request has been sent')
      
      // Reset form
      formik.resetForm();
    }
  });

  const handleKeyDown = (e) => {
    if (['Enter', 'Tab', ','].includes(e.key)) {
      e.preventDefault();
      const value = formik.values.emailInput.trim();
      
      if (value && isValidEmail(value)) {
        // Add the email and clear input
        formik.setFieldValue('receiverEmails', [...formik.values.receiverEmails, value]);
        formik.setFieldValue('emailInput', '');
        // Clear any existing errors
        formik.setFieldError('receiverEmails', undefined);
      } else {
        // Set validation error
        formik.setFieldError('receiverEmails', 'Please enter a valid email address');
      }
    }
  };

  const handleDelete = (emailToDelete) => {
    formik.setFieldValue(
      'receiverEmails', 
      formik.values.receiverEmails.filter(email => email !== emailToDelete)
    );
  };

  const handleSuggestionClick = (suggestion) => {
    if (!formik.values.receiverEmails.includes(suggestion)) {
      formik.setFieldValue('receiverEmails', [...formik.values.receiverEmails, suggestion]);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      formik.setStatus('Only PDF, JPG, PNG, and DOCX files are allowed');
      return;
    }

    const newAttachments = validFiles.map(file => ({
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file
    }));

    formik.setFieldValue('attachments', [...formik.values.attachments, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    formik.setFieldValue(
      'attachments', 
      formik.values.attachments.filter(attachment => attachment.id !== id)
    );
  };

  const getFileTypeIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('word')) return '📝';
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-1">Email Draft</h2>
      <p className="text-gray-500 mb-4">
        Preview, edit, and approve to send the email from within the same interface.
      </p>

      <hr className='mb-4 border-gray-200' />

      {formik.status && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {formik.status}
        </div>
      )}

      <EmailBox 
        formik={formik}
        handleKeyDown={handleKeyDown} 
        handleDelete={handleDelete} 
        handleSuggestionClick={handleSuggestionClick} 
        handleAttachmentClick={handleAttachmentClick} 
        handleFileChange={handleFileChange} 
        removeAttachment={removeAttachment} 
        getFileTypeIcon={getFileTypeIcon} 
        formatFileSize={formatFileSize} 
        fileInputRef={fileInputRef}
      />
    </div>
  );
}