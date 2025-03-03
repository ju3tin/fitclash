"use client"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Sidebar from './sidebar';
import Login from './login';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

const handleClick = () => {
  console.log("Button clicked!");
};

  return (
    <>
      <header className="flex justify-between items-center p-4 bg-black-900 text-white shadow-md relative">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white p-2">
          <Menu size={24} />
        </button>
       
        <div>
        {/*  <Link href="/login"> */}
           <Login />
       {/*     </Link>*/}
        </div>
      </header>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 shadow-lg`}
      >
         <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={() => setMenuOpen(false)} className="text-white">
            <X size={24} />
          </button>
        </div>
      <Sidebar />
      </div>
    </>
  );
};

export default Header;
