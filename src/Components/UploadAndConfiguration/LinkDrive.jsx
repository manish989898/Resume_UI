import React, { useState } from 'react';

export default function LinkDrive() {
  const [link, setLink] = useState('');

  return (
    <div className="flex-1 p-10">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Link Google Drive Folder</h2>
        <p className="text-gray-500">Integrate your cloud docs with a single step.</p>

        <hr className='mt-4 border-gray-200' />
      </div>

        <div className="mb-6">
          <div className="relative flex gap-2">
            <input
              type='text'
              value={link}
              placeholder='Paste your Google Drive folder link here (e.g- https://drive.google.com/drive/my-drive)'
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-4 py-2 bg-[#1B61AD] text-white text-sm rounded-md hover:bg-white hover:text-[#1B61AD] border border-[#1B61AD] transition">
            Link
          </button>
          </div>
        </div>

      </div>
  );
}