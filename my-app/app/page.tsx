import Link from "next/link";

export default function Home() {
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
      <div className="w-4/5 mt-4 text-gray-600 text-center">
        <p>No scavenger hunts available yet.</p>
      </div>
    </div>
  );
}
