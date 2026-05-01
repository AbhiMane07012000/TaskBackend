'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const items = [{href:'/dashboard',label:'Dashboard'},{href:'/projects',label:'Projects'},{href:'/tasks',label:'Tasks'},{href:'/users',label:'Users'},{href:'/notifications',label:'Notifications'},{href:'/plans',label:'Plans'}];
export default function Sidebar(){const p=usePathname();return <aside className='w-60 min-h-screen bg-white border-r p-4'><h2 className='font-bold mb-4'>Task Portal</h2><nav className='space-y-2'>{items.map(i=><Link key={i.href} href={i.href} className={`block px-3 py-2 rounded ${p===i.href?'bg-blue-100 text-blue-700':'hover:bg-slate-100'}`}>{i.label}</Link>)}</nav></aside>}
