import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="d-flex min-vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: '250px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;