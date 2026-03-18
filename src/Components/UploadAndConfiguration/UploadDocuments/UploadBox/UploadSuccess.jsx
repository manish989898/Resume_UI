export default function UploadSuccess({ resetUpload }) {
  return (
    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-green-800 font-medium">Files uploaded successfully!</span>
      </div>
      <button
        onClick={resetUpload}
        className="mt-3 text-sm text-[#1B61AD] hover:underline"
      >
        Upload more files
      </button>
    </div>
  );
}