import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { getInitials } from '../../utils/formatters';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'success');
      navigate('/login');
    } catch (error) {
      showToast('Logout failed', 'error');
    }
  };

  return (
    <nav className="bg-white border-b border-border shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 hover:bg-gray-100 rounded transition"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} className="text-foreground" />
            </button>
          )}
          <h1 className="text-2xl font-bold text-primary">Task Manager</h1>
        </div>

        <div className="flex items-center gap-6">
          {/* Notification Bell */}
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition relative"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-foreground" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-danger rounded-full"></span>
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded transition"
            >
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                {user ? getInitials(user.firstName, user.lastName) : 'U'}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-foreground">
                {user?.firstName}
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-foreground hover:bg-gray-100 flex items-center gap-2 transition"
                >
                  <User size={16} />
                  Profile Settings
                </button>
                <hr className="border-border my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-danger hover:bg-red-50 flex items-center gap-2 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
