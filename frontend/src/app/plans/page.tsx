'use client';
import AppShell from '@/components/layout/app-shell';
import { planApi } from '@/lib/api/services';
import { useMutation, useQuery } from '@tanstack/react-query';

export default function PlansPage(){const {data}=useQuery({queryKey:['plans'],queryFn:()=>planApi.list().then(r=>r.data)});const sub=useMutation({mutationFn:planApi.subscribe});
return <AppShell><h1 className='text-2xl font-bold mb-4'>Subscription Plans</h1><div className='grid md:grid-cols-3 gap-3'>{data?.items?.map((p:any)=><div key={p.id} className='bg-white p-4 rounded shadow'><h3 className='font-semibold'>{p.name}</h3><p>${p.price}/{p.interval}</p><button onClick={()=>sub.mutate({planId:p.id})} className='mt-3 bg-brand text-white px-3 py-2 rounded'>Subscribe</button></div>)}</div></AppShell>}
