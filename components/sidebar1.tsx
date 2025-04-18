'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Menu Button */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="p-2 m-2 text-white bg-gray-800 rounded-md md:hidden">
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:w-64`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={() => setIsOpen(false)} className="text-white md:hidden">
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col gap-4 p-4">
          <Link href="/" className="hover:bg-gray-700 p-2 rounded">Home</Link>
          <Link href="/about" className="hover:bg-gray-700 p-2 rounded">About</Link>
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
