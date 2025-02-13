'use client'
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [scavengerHunts, setScavengerHunts] = useState<any[]>([]); // state to hold the fetched scavenger hunts
  const [loading, setLoading] = useState<boolean>(true); // state to handle loading state

  useEffect(() => {
    const fetchScavengerHunts = async () => {
      try {
        const response = await fetch("/api/getAllScavengerHunts"); // Your API endpoint
        if (response.ok) {
          const data = await response.json();
          setScavengerHunts(data); // Set the fetched data to the state
        } else {
          console.error("Failed to fetch scavenger hunts.");
        }
      } catch (error) {
        console.error("Error fetching scavenger hunts:", error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchScavengerHunts(); // Call the function to fetch data on page load
  }, []); // Empty dependency array ensures this runs only on initial load

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="w-full bg-black text-white py-5 px-6 flex items-center">
        <h1 className="text-xl font-bold">Scavenger Hunt</h1>
      </nav>

      {/* Create Scavenger Hunt Button */}
      <div className="mt-6">
        <Link href="/createScavengerHunt">
          <button className="bg-black text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-800 transition">
            Create a Scavenger Hunt
          </button>
        </Link>
      </div>

      {/* Divider Line */}
      <div className="w-4/5 mt-6 border-t border-gray-400"></div>

      {/* Placeholder for Scavenger Hunts */}
      <div className="w-4/5 mt-6 text-gray-600 text-center">
        <p>No scavenger hunts available yet.</p>
      </div>

      {/* Grid for displaying scavenger hunts */}
      <div className="w-4/5 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          scavengerHunts.map((hunt) => (
            <div
              key={hunt._id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold mb-4">{hunt.title}</h3>
              <p>{hunt.description || "No description available"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
