"use client"
import Image from "next/image";
import Footer from "../../../components/footer1";
import { useEffect } from 'react';

export default function Home() {
  function gotopage() {
    window.location.href = "/app/index.html";

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
            className="dark:invert"
            src="/images/logo2.png"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
        </div>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
           Get Started by Clicking  Play Now.
          </li>
          <li>Or Launch App</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
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
        {/*   <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/app/index.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Launch App
          </a>*/}
          <button onClick={gotopage} className="border-gradient button5">
          Launch App
</button>

        </div>
      </main>
  <Footer />
    </div>
  );
}