'use client';
import { useForm } from 'react-hook-form';
import { authApi } from '@/lib/api/services';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function RegisterPage(){const {register,handleSubmit}=useForm<{name:string;email:string;password:string}>();const router=useRouter();
const submit=handleSubmit(async(data)=>{try{await authApi.register(data);toast.success('Registered');router.push('/login');}catch{toast.error('Register failed');}});
return <div className='min-h-screen grid place-items-center'><form onSubmit={submit} className='bg-white p-6 rounded shadow w-full max-w-sm space-y-3'><h1 className='text-xl font-semibold'>Register</h1><input className='w-full border p-2' placeholder='Name' {...register('name')}/><input className='w-full border p-2' placeholder='Email' {...register('email')}/><input className='w-full border p-2' type='password' placeholder='Password' {...register('password')}/><button className='bg-brand text-white px-4 py-2 rounded w-full'>Register</button></form></div>}
