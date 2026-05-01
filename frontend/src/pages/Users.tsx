import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { Plus } from 'lucide-react';

export const Users: React.FC = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <MainLayout>
        <div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Users</h1>
              <p className="text-muted mt-2">Manage system users and their roles</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
              <Plus size={20} />
              Add User
            </button>
          </div>

          {/* Placeholder content */}
          <div className="bg-white rounded-lg shadow p-12 text-center border border-border">
            <p className="text-muted mb-4">No users to display</p>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};
