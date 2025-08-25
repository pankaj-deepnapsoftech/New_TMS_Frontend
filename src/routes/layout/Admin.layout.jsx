import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@components/shared/Header';
import Sidebar from '@components/shared/Sidebar';

const Adminlayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar (hover-expand) */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar + tabs */}
        <Header />

        {/* Content */}
        <div className="flex-1 overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Adminlayout;
