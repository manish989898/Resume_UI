// Packages and Libraries
import { Document, Page } from 'react-pdf';

export default function FilePreview({viewingFile,handleCloseViewer}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">{viewingFile.name}</h3>
              <button 
                onClick={handleCloseViewer}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto flex items-center justify-center">
              {viewingFile.type.startsWith('image/') ? (
                <img 
                  src={viewingFile.url} 
                  alt={viewingFile.name}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              ) : viewingFile.type === 'application/pdf' || viewingFile.name.endsWith('.pdf') ? (
                <iframe 
                  src={viewingFile.url} 
                  title={viewingFile.name}
                  className="w-full h-[70vh] border-0"
                />
              ) : (
                <div className="text-center p-8">
                  <p className="text-xl mb-4">Preview not available for this file type</p>
                  <a
                    href={viewingFile.url}
                    download={viewingFile.name}
                    className="inline-block px-6 py-2 bg-[#1B61AD] text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
  )
}
