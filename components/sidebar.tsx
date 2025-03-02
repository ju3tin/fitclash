"use client"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
  
   <>
    
        <nav className="p-4 space-y-4">
          <Link href="/" className="block py-2 px-4 hover:bg-gray-700 rounded">Home</Link>
          <Link href="/faq" className="block py-2 px-4 hover:bg-gray-700 rounded">Faq</Link>
          <Link href="/services" className="block py-2 px-4 hover:bg-gray-700 rounded">Services</Link>
          <Link href="/contact" className="block py-2 px-4 hover:bg-gray-700 rounded">Contact</Link>
        </nav>
   </>
  
  );
};

export default Sidebar;
