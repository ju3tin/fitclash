"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";

const Home = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (!searchParams) return; // Check if searchParams is available

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('tags', JSON.stringify(tags));
    router.push(`?${currentParams.toString()}`);
  }, [tags, searchParams, router]);

  return (
    <div>
      Router: {JSON.stringify(searchParams?.toString())} {/* Use optional chaining */}
      <br />
      Tags: {JSON.stringify(tags)}
      <br />
      <button onClick={() => setTags((prev) => [...prev, "foo"])}>
        Add tag
      </button>
    </div>
  );
};

export default Home;