import React, { useState } from 'react';

// Icons
import EyeIcon from '../../assets/icons/EyeIcon';
import EyeSlashIcon from '../../assets/icons/EyeSlashIcon';

export default function EmailDb() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex-1 p-10">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Email & DB Credentials</h2>
        <p className="text-gray-500">Securely connect your communication and storage.</p>

        <hr className='mt-4 border-gray-200' />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-full">
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value="sukantajge.14@gmail.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value="password123"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-100">
            Edit
          </button>
          <button className="px-4 py-2 bg-[#1B61AD] text-white text-sm rounded-md hover:bg-white hover:text-[#1B61AD] border border-[#1B61AD] transition">
            Share Credentials
          </button>
        </div>
      </div>
    </div>
  );
}