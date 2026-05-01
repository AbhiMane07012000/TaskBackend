'use client';
import AppShell from '@/components/layout/app-shell';
import { RoleGate } from '@/components/auth/protected-route';
import { projectApi } from '@/lib/api/services';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';

export default function ProjectDetails(){const {id}=useParams<{id:string}>();const {data,refetch}=useQuery({queryKey:['project',id],queryFn:()=>projectApi.get(id).then(r=>r.data)});const update=useMutation({mutationFn:(payload:any)=>projectApi.update(id,payload),onSuccess:()=>refetch()});const del=useMutation({mutationFn:()=>projectApi.remove(id)});
return <AppShell><h1 className='text-2xl font-bold mb-3'>{data?.name}</h1><p className='mb-4'>{data?.description}</p><RoleGate roles={['ADMIN','SUPER_ADMIN']}><button className='border px-3 py-2 mr-2' onClick={()=>update.mutate({name:`${data?.name} Updated`})}>Edit</button></RoleGate><RoleGate roles={['SUPER_ADMIN']}><button className='bg-red-500 text-white px-3 py-2' onClick={()=>del.mutate()}>Delete</button></RoleGate></AppShell>}
