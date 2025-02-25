"use client"
import Image from "next/image";
import Footer from "../../../components/footer1";
import { useEffect } from 'react';

export default function Home() {
  function gotopage() {
    window.location.href = "/app/multi.html";

  }

  function gotopage1() {
    window.location.href = "/app/p4p.html";

  }

  useEffect(() => {
    const element = document.querySelector(".border-gradient") as HTMLElement;

    if (element) {
      let angle = 0;
      const rotateGradient = () => {
        angle = (angle + 1) % 360; // Increment angle and keep it within 0-360
        element.style.setProperty("--gradient-angle", `${angle}deg`);
        requestAnimationFrame(rotateGradient); // Smooth animation loop
      };

      rotateGradient(); // Start the animation
    }
  }, []); // Empty dependency array to run once on mount

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto'}}>
          <Image
            className="4dark:invert"
            src="/images/logo2.png"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
        </div>
        
      <h1 style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: '2.5rem', fontWeight: '500'}}> Choose Your Game</h1>
      <h2 style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: '1.25rem'}}> Play the Peer to Peer Game or a multiplayer game</h2>

        <div style={{ marginLeft: 'auto', marginRight: 'auto'}} className="flex gap-4 items-center flex-col sm:flex-row">
        {/*   
        <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/games"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/logo.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Play now
          </a>
        <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/app/index.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Launch App
          </a>
         
          <button onClick={gotopage} className="border-gradient button5">
          Launch App
</button> */}
<Image onClick={gotopage1}
style={{cursor: 'pointer'}}
            className="dark:invert"
            src="/images/p2p.png"
            alt="Next.js logo"
            width={120}
            height={120}
            priority
          />
<Image onClick={gotopage}
style={{cursor: 'pointer'}}
            className="4dark:invert"
            src="/images/multiplayer.png"
            alt="Next.js logo"
            width={120}
            height={120}
            priority
          />
        </div>
      </main>
  <Footer />
    </div>
  );
}