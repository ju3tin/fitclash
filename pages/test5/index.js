"use client"
import { useState, useEffect } from 'react';

export default function Test5() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/hello');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Data</h1>
      <div className="grid gap-4">
        {data.users.map(user => (
          <div key={user.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">Role: {user.role}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Stats</h2>
        <p>Total Users: {data.stats.totalUsers}</p>
        <p>Active Users: {data.stats.activeUsers}</p>
        <p>Last Updated: {new Date(data.stats.lastUpdated).toLocaleString()}</p>
      </div>
    </div>
  );
}
