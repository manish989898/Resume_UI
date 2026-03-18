export default function UploadProgress({ uploadProgress }) {
  return (
    <div className="mt-6">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-[#1B61AD] h-2.5 rounded-full" 
          style={{ width: `${uploadProgress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        Uploading... {uploadProgress}% complete
      </p>
    </div>
  );
}