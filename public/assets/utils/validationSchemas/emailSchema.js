// Packages and Libraries
import * as Yup from 'yup';

// Validation Schema
export const EmailSchema = Yup.object().shape({
    senderEmail: Yup.string()
      .email('Invalid sender email')
      .required('Sender email is required'),
    receiverEmails: Yup.array()
      .min(1, 'At least one recipient is required')
      .of(Yup.string().email('Invalid recipient email')),
    emailContent: Yup.string()
      .min(10, 'Email content must be at least 10 characters')
      .required('Email content is required'),
    attachments: Yup.array().test(
      'fileSize',
      'Total attachment size must be less than 10MB',
      (files) => {
        if (!files) return true;
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        return totalSize <= 10 * 1024 * 1024; // 10MB
      }
    )
  });