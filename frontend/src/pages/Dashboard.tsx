import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { projectsService } from '../services/api/projects';
import { tasksService } from '../services/api/tasks';
import { usersService } from '../services/api/users';
import { FolderOpen, CheckSquare, Users, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    totalUsers: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsData, tasksData, usersData] = await Promise.all([
          projectsService.getAll(1, 100),
          tasksService.getAll({ page: 1, limit: 100 }),
          usersService.getAll(1, 100),
        ]);

        const completedTasks = tasksData.data.filter(t => t.status === 'completed').length;

        setStats({
          totalProjects: projectsData.total,
          totalTasks: tasksData.total,
          totalUsers: usersData.total,
          completedTasks,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderOpen,
      color: 'bg-blue-50 text-primary',
    },
    {
      label: 'Total Tasks',
      value: stats.totalTasks,
      icon: CheckSquare,
      color: 'bg-green-50 text-secondary',
    },
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Completed Tasks',
      value: stats.completedTasks,
      icon: TrendingUp,
      color: 'bg-orange-50 text-warning',
    },
  ];

  return (
    <MainLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-muted">Here&apos;s an overview of your task management system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white rounded-lg shadow p-6 border border-border">
                <div className={`inline-flex p-3 rounded-lg ${card.color} mb-4`}>
                  <Icon size={24} />
                </div>
                <p className="text-muted text-sm mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-foreground">{card.value}</p>
              </div>
            );
          })}
        </div>

        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg shadow p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Get Started</h2>
          <p className="opacity-90 mb-4">
            You can manage your projects, tasks, and team members from the sidebar menu. Start by
            creating a new project or browsing existing ones.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};
