"use client"
import Footer from '../../../components/footer'
import { useEffect, useState } from "react";
import Video from '../../../components/video'
import Selection from '../../../components/selection'
import { PreloadResources } from '../../../components/externalstyle'
import Masthead from '../../../components/masthead'
import FrontContent from '../../../components/frontcontent'
import SearchContent from '../../../components/searchcontent'
import instantsearch from 'instantsearch.js'
import { Analytics } from "@vercel/analytics/react"
import axios from "axios";
import Link from "next/link";
import { hits, searchBox } from 'instantsearch.js/es/widgets'


interface Game {
  id: number;
  image: string;
  link: string;
  title: string;
}


export default function Page() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get("/api/games.json"); // Replace with your API endpoint
        setGames(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load games");
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;


  return (
    <main>
      <PreloadResources />
      <div style={styles.container}>
      <h1>Game Gallery</h1>
      <div style={styles.grid}>
        {games.map((game) => (
          <div key={game.id} style={styles.card}>
            <Link href={game.link}>
              <img src={game.image} alt={game.title} style={styles.image} />
              <h3>{game.title}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
      <Footer />
      <Analytics/>
    </main>
  )
}
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center" as const,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    textAlign: "center" as const,
    transition: "transform 0.3s",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover" as const,
  },
};