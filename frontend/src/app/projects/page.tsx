'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '@/lib/api/services';
import { useState } from 'react';
import AppShell from '@/components/layout/app-shell';
import { RoleGate } from '@/components/auth/protected-route';

export default function ProjectsPage(){const [search,setSearch]=useState('');const qc=useQueryClient(); const {data}=useQuery({queryKey:['projects',search],queryFn:()=>projectApi.list({search}).then(r=>r.data)});
const create=useMutation({mutationFn:projectApi.create,onSuccess:()=>qc.invalidateQueries({queryKey:['projects']})});
return <AppShell><div className='flex justify-between mb-4'><h1 className='text-2xl font-bold'>Projects</h1><input className='border p-2' placeholder='Search' value={search} onChange={e=>setSearch(e.target.value)} /></div><RoleGate roles={['ADMIN','SUPER_ADMIN']}><button className='bg-brand text-white px-3 py-2 rounded mb-3' onClick={()=>create.mutate({name:'New Project'})}>Create project</button></RoleGate><div className='space-y-3'>{data?.items?.map((p:any)=><a key={p.id} href={`/projects/${p.id}`} className='block bg-white p-4 rounded shadow'>{p.name}</a>)}</div></AppShell>}
