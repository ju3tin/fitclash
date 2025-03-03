"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { signInWithGoogle } from "../lib/auth";
import { useState } from "react";
import Image from "next/image";

const LoginButton = () => {
  const { connected } = useWallet();
  const [user, setUser] = useState(null);

  const handleGoogleLogin = async () => {
    const user = await signInWithGoogle();
    setUser(user);
  };

  return (
    <div className="flex gap-4">
      {/* Solana Wallet Login */}
      <WalletMultiButton className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2" />

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
      >
        <Image src="/images/google.svg" alt="Google Logo" width={20} height={20} />
        Login with Google
      </button>
    </div>
  );
};

export default LoginButton; // ✅ Ensure correct export