'use client';
import AppShell from '@/components/layout/app-shell';
import { RoleGate } from '@/components/auth/protected-route';
import { userApi } from '@/lib/api/services';
import { useQuery } from '@tanstack/react-query';

export default function UsersPage(){const {data}=useQuery({queryKey:['users'],queryFn:()=>userApi.list().then(r=>r.data)});
return <AppShell><RoleGate roles={['ADMIN','SUPER_ADMIN']}><h1 className='text-2xl font-bold mb-4'>Users</h1><div className='space-y-2'>{data?.items?.map((u:any)=><div key={u.id} className='bg-white p-3 rounded shadow flex justify-between'><span>{u.name} ({u.role})</span><button className='border px-2 py-1'>Edit</button></div>)}</div></RoleGate></AppShell>}
