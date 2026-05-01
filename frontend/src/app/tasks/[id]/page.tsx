'use client';
import AppShell from '@/components/layout/app-shell';
import { taskApi } from '@/lib/api/services';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function TaskDetails(){const {id}=useParams<{id:string}>();const [comment,setComment]=useState('');const {data,refetch}=useQuery({queryKey:['task',id],queryFn:()=>taskApi.get(id).then(r=>r.data)});const add=useMutation({mutationFn:()=>taskApi.comment(id,{content:comment}),onSuccess:()=>{setComment('');refetch();}});
return <AppShell><h1 className='text-2xl font-bold'>{data?.title}</h1><p>{data?.description}</p><h3 className='font-semibold mt-4'>Comments</h3>{data?.comments?.map((c:any)=><p key={c.id} className='bg-white rounded p-2 my-2'>{c.content}</p>)}<div className='flex gap-2'><input className='border p-2 flex-1' value={comment} onChange={e=>setComment(e.target.value)} /><button onClick={()=>add.mutate()} className='bg-brand text-white px-4'>Add</button></div></AppShell>}
