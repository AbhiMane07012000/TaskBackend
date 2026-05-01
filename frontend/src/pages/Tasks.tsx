import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Plus } from 'lucide-react';

export const Tasks: React.FC = () => {
  return (
    <MainLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
            <p className="text-muted mt-2">View and manage all your tasks</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
            <Plus size={20} />
            New Task
          </button>
        </div>

        {/* Placeholder content */}
        <div className="bg-white rounded-lg shadow p-12 text-center border border-border">
          <p className="text-muted mb-4">No tasks yet. Create one to get started!</p>
        </div>
      </div>
    </MainLayout>
  );
};
