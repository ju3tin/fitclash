"use client"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Sidebar from './sidebar';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

const handleClick = () => {
  console.log("Button clicked!");
};

  return (
    <>
      <header style={{zIndex:'4000',width:'100%',top:'0%',position:'absolute'}} className="flex justify-between items-center p-4 bg-black-900 text-white shadow-md">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white p-2">
          <Menu size={24} />
        </button>
        <div className="flex-1 flex justify-center">
          <Image src="/images/logo2.png" alt="Logo" width={40} height={40} />
        </div>
        <div>
        {/*  <Link href="/login"> */}
            <button onClick={handleClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Login<Image src="/images/login.svg" alt="Logo" width={20} height={20} />
            </button>
       {/*     </Link>*/}
        </div>
      </header>

      {/* Sidebar Menu */}
      <div style={{zIndex:4003}} className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 shadow-lg`}
      >
         <div className="flex justify-between items-center p-4 border-b border-gray-700">
         <Image src="/images/logo2.png" alt="Logo" width={30} height={30} /><span className="text-lg font-semibold">Menu</span>
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
