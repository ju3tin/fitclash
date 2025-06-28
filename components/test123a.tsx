"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import VideoCall from "./video-call6";
import Form from "./form";

export default function HomeContent() {
  const searchParams = useSearchParams();
  const gameFromUrl = searchParams ? searchParams.get("game") : null;

  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [selectedGameData, setSelectedGameData] = useState<{
    game: any;
    betAmount: number;
    duration: { hours: number; minutes: number; seconds: number };
  } | null>(null);

  const showOverlay = () => setOverlayVisible(true);
  const hideOverlay = () => setOverlayVisible(false);

  const handleSelect = (game, betAmount, duration) => {
    const data = { game, betAmount, duration };
    setSelectedGameData(data);
    hideOverlay();
  };

  useEffect(() => {
    if (gameFromUrl && !selectedGameData) {
      const requestOptions = {
        method: "GET",
        redirect: "follow" as RequestRedirect,
      };

      // Construct the URL with query parameters
      const url = `/api/room?room=${gameFromUrl}&game=dsfsfd`;

      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          setSelectedGameData((prevData) => ({
            game: prevData ? prevData.game : gameFromUrl,
            betAmount: result.betAmount,
            duration: prevData ? prevData.duration : { hours: 0, minutes: 0, seconds: 0 },
          }));
        })
        .catch((error) => console.error(error));

      setSelectedGameData({
        game: gameFromUrl,
        betAmount: 0,
        duration: { hours: 0, minutes: 0, seconds: 0 },
      });
    }
  }, [gameFromUrl]);

  return (
    <>
      {isOverlayVisible && (
        <Form setOverlayVisible={setOverlayVisible} onSelect={handleSelect} />
      )}

      <div className="mb-8 text-center flex flex-col items-center">
        <img src="/images/logo1.png" width="20%" className="w-1/5" />
        <h1 className="text-gray-600">Test Your Fitness Against Your Friends with Our Games</h1>
        <h2 className="text-gray-600">Click The Button Below To Start.</h2>
        {gameFromUrl === null && (
          <p>
            <button
              onClick={showOverlay}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 flex items-center"
            >
              <img src="/images/gameicon.svg" alt="My Icon" className="w-5 h-5 mr-2" />
              Start game
            </button>
          </p>
        )}
      </div>
<div className="" >
      <VideoCall
        onSelect={handleSelect}
        gameFromUrl={gameFromUrl}
        selectedGameData={selectedGameData}
        setSelectedGameData={setSelectedGameData}
        hideOverlay={hideOverlay}
      />
      </div>
    </>
  );
}
