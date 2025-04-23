"use client"
import VideoCall from "../../../components/video-call"
import "../globals.css"
import Form from "../../../components/form";
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';


export default function Home() {
  

const searchParams = useSearchParams(); 
const gameFromUrl = searchParams ? searchParams.get("game") : null;
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [selectedGameData, setSelectedGameData] = useState<{
    game: any;
    betAmount: number;
    duration: { hours: number; minutes: number; seconds: number };
  } | null>(null);

  const showOverlay = () => {
    setOverlayVisible(true);
  };

  const hideOverlay = () => {
    setOverlayVisible(false);
  };

  // Define the onSelect function
  const handleSelect = (game, betAmount, duration) => {
    const data5 = {
      game,
      betAmount,
      duration,
    };

    console.log("Selected game:", game);
    console.log("Bet Amount:", betAmount);
    console.log("Duration:", duration);
    setSelectedGameData(data5);
    hideOverlay(); // Optionally hide the overlay after selection
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      {isOverlayVisible && (
        
        <Form setOverlayVisible={setOverlayVisible} onSelect={handleSelect} />
        
      )}
      <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-center flex flex-col items-center">
         <img src="/images/logo1.png" width="20%" className="w-1/5"/>
          <h1 className="text-gray-600">Test Your Fitness Against Your Friends with Our Games</h1>
          <h2 className="text-gray-600">Click The Button Below To Start.</h2>
          <p>
            {gameFromUrl === null && (
              <button 
                onClick={showOverlay} 
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 flex items-center"
              >
                <img src="/images/gameicon.svg" alt="My Icon" className="w-5 h-5 mr-2" />
                Start game
              </button>
            )}
          </p>
        </div>
      
        <VideoCall 
          onSelect={handleSelect} 
          gameFromUrl={gameFromUrl}  
          selectedGameData={selectedGameData} 
          setSelectedGameData={setSelectedGameData} 
          hideOverlay={hideOverlay}
        />
      
      </div>
    </main>
  )
}
