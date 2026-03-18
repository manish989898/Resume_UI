import React, { useState, useRef, useEffect } from 'react';

// Packages and Libraries
import { NavLink, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Icons
import { FaMoon } from 'react-icons/fa';
import { BellIcon } from '../../assets/icons/BellIcon';

// Images
import profileImage from '../../assets/images/profileImage.png';

// Logos
import bimDigitalLogo from '../../assets/logos/BimDigitalLogo.png';
// Components
import Login from '../Authorization/Login';
import Signup from '../Authorization/SignUp';
import Dashboard from "../Dashboard/Dashboard";
import UploadSidebar from "../UploadAndConfiguration/UploadSidebar";
import Review from "../Review/Review";
import Transactions from "../Transactions/Transactions";
import InvoiceWorkbench from '../Dashboard/Invoice/InvoiceWorkbench';
import InvoiceProcessingMetrics from '../Dashboard/Invoice/InvoiceProcessingMetrics';
import AccountsReceivable from '../Dashboard/Accounts/AccountsReceivable';
import CashFlowDashboard from '../Dashboard/CashFlowDashboard';
import Home from '../Home/Home';
import About from '../Home/About';

export default function Navbar({ isLoggedIn, handleLogin, handleLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ProtectedRoute component
  const ProtectedRoute = () => {
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
  };

  // PublicRoute component
  const PublicRoute = () => {
    return !isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
  };

  // Protected routes array
  const protectedRoutes = [
    { path: '/home', element: <Home />, exact: true },
    { path: '/about', element: <About />, exact: true },
    { path: '/', element: <Dashboard />, exact: true },
    { path: '/invoiceProcessingMetrics', element: <InvoiceProcessingMetrics />, exact: true },
    { path: '/invoiceWorkbench', element: <InvoiceWorkbench />, exact: true },
    { path: '/accountsReceivable', element: <AccountsReceivable />, exact: true },
    { path: '/cashflow', element: <CashFlowDashboard />, exact: true },
    { path: '/upload', element: <UploadSidebar /> },
    { path: '/review', element: <Review /> },
    { path: '/transactions', element: <Transactions /> },
  ];

  // Public routes array
  const publicRoutes = [
    { path: '/login', element: <Login handleLogin={handleLogin} /> },
    { path: '/signup', element: <Signup handleLogin={handleLogin} /> }
  ];

  return (
    <>
      {/* Navbar */}
      {isLoggedIn && (
        <div className="w-full bg-[#e8eff7] shadow-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              {/* Left: Logo/Brand */}
              <div className="flex items-center">
                             <div className="flex items-center text-4xl font-semibold gap-4">
                               <img src={bimDigitalLogo} alt="BIM Digital Logo" className="mr-10 w-20 h-20 object-contain" />
                               
                             </div>
                
                {/* Navigation Links - Home and Dashboard only */}
                <div className="hidden md:flex items-center ml-10 space-x-8">
                  <NavLink
                    to="/home"
                    end
                    className={({ isActive }) =>
                      `text-base font-medium pb-1.5 border-b-2 transition-colors duration-200 ${
                        isActive
                          ? 'text-[#1B61AD] border-[#1B61AD]'
                          : 'text-gray-800 border-transparent hover:text-[#1B61AD] hover:border-[#1B61AD]'
                      }`
                    }
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      `text-base font-medium pb-1.5 border-b-2 transition-colors duration-200 ${
                        isActive
                          ? 'text-[#1B61AD] border-[#1B61AD]'
                          : 'text-gray-800 border-transparent hover:text-[#1B61AD] hover:border-[#1B61AD]'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                </div>
              </div>

              {/* Right: Theme toggle, Notification and Profile */}
              <div className="flex items-center space-x-6">
                {/* Theme icon (placeholder for future) */}
                <button
                  type="button"
                  className="p-2 text-gray-800 hover:bg-gray-200 rounded-full hover:text-[#1B61AD] focus:outline-none transition-colors duration-200 cursor-default"
                  aria-label="Theme"
                >
                  <FaMoon className="w-5 h-5" />
                </button>
                {/* Notification icon with badge */}
                <div className="relative">
                  <button className="text-gray-800 hover:bg-gray-200 rounded-full hover:p-4 hover:text-[#1B61AD] focus:outline-none transition-colors duration-200">
                    <BellIcon className="w-6 h-6" />
                  </button>
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                    2
                  </span>
                </div>
                
                {/* Profile dropdown/logout */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="focus:outline-none"
                  >
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="rounded-full w-9 h-9 border-2 border-[#1B61AD] cursor-pointer"
                    />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content area with routes */}
      <div className="max-w-7xl mx-auto px-6 py-6 bg-gray-50 min-h-screen">
        <Routes>
          {/* Public routes */}
          <Route element={<PublicRoute />}>
            {publicRoutes.map((route) => (
              <Route 
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            {protectedRoutes.map((route) => (
              <Route 
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>

          {/* Redirects */}
          <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
        </Routes>
      </div>
    </>
  );
}