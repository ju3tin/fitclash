import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-md">
      <div className="w-1/3"></div> {/* Empty div to balance flex alignment */}
      <div className="w-1/3 flex justify-center">
        <Image src="/images/logo2.png" alt="Logo" width={60} height={50} />
      </div>
      <div className="w-1/3 flex justify-end">
        <Link href="/login">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Login
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
