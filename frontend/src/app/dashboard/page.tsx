'use client';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, notificationApi } from '@/lib/api/services';
import AppShell from '@/components/layout/app-shell';

export default function DashboardPage(){const {data}=useQuery({queryKey:['stats'],queryFn:()=>dashboardApi.stats().then(r=>r.data)});const {data:notes}=useQuery({queryKey:['notes'],queryFn:()=>notificationApi.list().then(r=>r.data)});
return <AppShell><h1 className='text-2xl font-bold mb-4'>Dashboard</h1><div className='grid md:grid-cols-3 gap-4 mb-6'>{['projects','tasks','users'].map(k=><div key={k} className='bg-white p-4 rounded shadow'><p className='text-sm uppercase'>{k}</p><p className='text-2xl font-semibold'>{data?.[k] ?? 0}</p></div>)}</div><div className='bg-white p-4 rounded shadow'><h2 className='font-semibold mb-2'>Recent notifications</h2>{notes?.slice(0,5)?.map((n:any)=><p key={n.id} className='text-sm py-1'>{n.message}</p>)}</div></AppShell>}
