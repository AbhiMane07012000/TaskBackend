import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, CheckSquare, Users, CreditCard, Settings, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Projects', icon: FolderOpen, path: '/projects' },
    { label: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { label: 'Users', icon: Users, path: '/users', adminOnly: true },
    { label: 'Subscriptions', icon: CreditCard, path: '/subscriptions' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const filteredItems = navItems.filter(
    item => !item.adminOnly || user?.role === 'admin'
  );

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-border overflow-y-auto transition-transform duration-300 transform md:translate-x-0 z-30 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-6">
        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded transition"
            aria-label="Close sidebar"
          >
            <X size={20} className="text-foreground" />
          </button>
        )}

        {/* Navigation */}
        <nav className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
