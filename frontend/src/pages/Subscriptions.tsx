import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';

export const Subscriptions: React.FC = () => {
  return (
    <MainLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Subscriptions</h1>
          <p className="text-muted mt-2">Manage your subscription and billing</p>
        </div>

        {/* Placeholder content */}
        <div className="bg-white rounded-lg shadow p-12 text-center border border-border">
          <p className="text-muted mb-4">Loading subscription plans...</p>
        </div>
      </div>
    </MainLayout>
  );
};
