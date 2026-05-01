'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!user) router.push('/login'); }, [user, router]);
  if (!user) return <div className='p-6'>Loading...</div>;
  return <>{children}</>;
}

export function RoleGate({ roles, children }: { roles: string[]; children: React.ReactNode }) {
  const { user } = useAuthStore();
  if (!user || !roles.includes(user.role)) return null;
  return <>{children}</>;
}
