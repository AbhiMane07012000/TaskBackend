import React from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';

export const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-8">Task {id}</h1>
        <div className="bg-white rounded-lg shadow p-12 text-center border border-border">
          <p className="text-muted mb-4">Task details coming soon</p>
        </div>
      </div>
    </MainLayout>
  );
};
