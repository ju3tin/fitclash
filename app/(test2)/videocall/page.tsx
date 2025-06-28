import "../globals.css";
import { Suspense } from "react";
import HomeContent from "../../../components/test123";
import Header from "../../../components/header";

export default function HomePage() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50 max-w-6xl mx-auto">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
