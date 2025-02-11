"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CreateScavengerHunt() {
  const [name, setName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const tagOptions = ["Valentine's Day", "Outdoor", "Adventure", "Mystery", "Family-Friendly"];

  useEffect(() => {
    // Load previous form data if available (for edit or refresh scenarios)
    const savedData = localStorage.getItem("scavengerHuntData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setName(parsedData.name || "");
      setTags(parsedData.tags || []);
      setLocation(parsedData.location || "");
      setIsPrivate(parsedData.isPrivate || false);
      setPassword(parsedData.password || "");
    }
  }, []);

  const toggleTag = (tag: string) => {
    setTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const handleNext = () => {
    // Save form data before navigating
    const huntData = { name, tags, location, isPrivate, password };
    localStorage.setItem("scavengerHuntData", JSON.stringify(huntData));
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="w-full bg-black text-white py-5 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Create a Scavenger Hunt</h1>
        <Link href="/">
          <button className="text-white bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition">
            Back
          </button>
        </Link>
      </nav>

      {/* Form */}
      <div className="mt-10 w-4/5 max-w-lg flex flex-col gap-4">
        {/* Scavenger Hunt Name */}
        <label>
          Scavenger Hunt Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        {/* Tags Selection */}
        <label>Select Tags:</label>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 border rounded ${
                tags.includes(tag) ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Location Input */}
        <label>
          Preferred Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        {/* Public/Private Toggle */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
          />
          Private Hunt (Requires Password)
        </label>

        {/* Password Input (Shown Only If Private) */}
        {isPrivate && (
          <label>
            Set a Password:
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </label>
        )}

        {/* Next Button */}
        <Link href="/createScavengerHuntHints">
          <button
            onClick={handleNext}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            Next
          </button>
        </Link>
      </div>
    </div>
  );
}
