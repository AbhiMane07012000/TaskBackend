import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../hooks/useAuth';

export const Settings: React.FC = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow border border-border p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
              <input
                type="text"
                defaultValue={user?.firstName}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
              <input
                type="text"
                defaultValue={user?.lastName}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input
                type="email"
                defaultValue={user?.email}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled
              />
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
              Update Profile
            </button>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-lg shadow border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Current Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Confirm new password"
              />
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
