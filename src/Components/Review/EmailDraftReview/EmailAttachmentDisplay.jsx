import React from 'react'

export default function EmailAttachmentDisplay({attachments,removeAttachment,getFileTypeIcon,formatFileSize}) {
  return (
    <>
        {attachments.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h3>
            <div className="flex flex-wrap gap-3">
              {attachments.map(attachment => (
                <div key={attachment.id} className="flex items-center bg-gray-50 rounded-md p-2 text-sm">
                  <span className="mr-2">{getFileTypeIcon(attachment.type)}</span>
                  <div className="mr-2">
                    <div className="font-medium truncate max-w-xs">{attachment.name}</div>
                    <div className="text-gray-500 text-xs">{formatFileSize(attachment.size)}</div>
                  </div>
                  <button 
                    onClick={() => removeAttachment(attachment.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
    </>
  )
}
