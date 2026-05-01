'use client';
import { useForm } from 'react-hook-form';
import { authApi } from '@/lib/api/services';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage(){const {register,handleSubmit}=useForm<{email:string;password:string}>();const setUser=useAuthStore(s=>s.setUser);const router=useRouter();
const submit=handleSubmit(async(data)=>{try{const res=await authApi.login(data);setUser(res.data.user);toast.success('Logged in');router.push('/dashboard');}catch{toast.error('Login failed');}});
return <div className='min-h-screen grid place-items-center'><form onSubmit={submit} className='bg-white p-6 rounded shadow w-full max-w-sm space-y-3'><h1 className='text-xl font-semibold'>Login</h1><input className='w-full border p-2' placeholder='Email' {...register('email')}/><input className='w-full border p-2' type='password' placeholder='Password' {...register('password')}/><button className='bg-brand text-white px-4 py-2 rounded w-full'>Login</button></form></div>}
