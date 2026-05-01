'use client';
import AppShell from '@/components/layout/app-shell';
import { taskApi } from '@/lib/api/services';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function TasksPage(){const [status,setStatus]=useState('');const [projectId,setProjectId]=useState('');const {data}=useQuery({queryKey:['tasks',status,projectId],queryFn:()=>taskApi.list({status,projectId}).then(r=>r.data)});
return <AppShell><h1 className='text-2xl font-bold mb-4'>Tasks</h1><div className='flex gap-2 mb-4'><input placeholder='Project ID' className='border p-2' value={projectId} onChange={e=>setProjectId(e.target.value)}/><select className='border p-2' value={status} onChange={e=>setStatus(e.target.value)}><option value=''>All</option><option>TODO</option><option>IN_PROGRESS</option><option>DONE</option></select></div><div className='space-y-3'>{data?.items?.map((t:any)=><a key={t.id} href={`/tasks/${t.id}`} className='block bg-white p-4 rounded shadow'><div className='flex justify-between'><span>{t.title}</span><span>{t.status}</span></div></a>)}</div></AppShell>}
