'use client';
import AppShell from '@/components/layout/app-shell';
import { notificationApi } from '@/lib/api/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function NotificationsPage(){const qc=useQueryClient();const {data}=useQuery({queryKey:['notifications'],queryFn:()=>notificationApi.list().then(r=>r.data)});const mark=useMutation({mutationFn:notificationApi.markRead,onSuccess:()=>qc.invalidateQueries({queryKey:['notifications']})});
return <AppShell><h1 className='text-2xl font-bold mb-4'>Notifications</h1>{data?.items?.map((n:any)=><div key={n.id} className='bg-white p-3 rounded shadow mb-2 flex justify-between'><span>{n.message}</span>{!n.isRead && <button onClick={()=>mark.mutate(n.id)} className='text-blue-600'>Mark read</button>}</div>)}</AppShell>}
