'use client';
import Sidebar from './sidebar';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute><div className='flex'><Sidebar /><main className='flex-1 p-6'>{children}</main></div></ProtectedRoute>;
}
