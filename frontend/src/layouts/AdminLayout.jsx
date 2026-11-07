import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="min-vh-100">
      <AdminSidebar />
      <div className="se-admin-main">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
