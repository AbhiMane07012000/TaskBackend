import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RegisterForm } from '../components/auth/RegisterForm';

export const Register: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Task Manager</h1>
          <p className="text-muted">Create a new account</p>
        </div>

        <RegisterForm />

        <p className="text-center mt-6 text-muted text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:text-primary-dark transition">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};
