"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ScavengerHuntHintDetails() {
  const [slides, setSlides] = useState<{ id: number; name: string; content: string; background: string }[]>([]);
  const [selectedSlide, setSelectedSlide] = useState<number | null>(null);

  useEffect(() => {
    // Load slides from local storage
    const savedSlides = localStorage.getItem("scavengerHuntSlides");
    if (savedSlides) {
      setSlides(JSON.parse(savedSlides));
    }
  }, []);

  useEffect(() => {
    // Save slides to local storage
    localStorage.setItem("scavengerHuntSlides", JSON.stringify(slides));
  }, [slides]);

  const addSlide = () => {
    const newSlide = { id: Date.now(), name: "New Slide", content: "New Hint", background: "" };
    setSlides([...slides, newSlide]);
    setSelectedSlide(newSlide.id);
  };

  const updateSlide = (id: number, key: string, value: string) => {
    setSlides(slides.map(slide => (slide.id === id ? { ...slide, [key]: value } : slide)));
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      {/* Navigation Bar */}
      <nav className="w-full bg-black text-white py-5 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Create a Scavenger Hunt</h1>
        <Link href="/">
          <button className="text-white bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition">
            Back
          </button>
        </Link>
      </nav>

      <div className="flex flex-grow">
        {/* Sidebar for slides */}
        <div className="w-1/4 bg-white p-4 shadow-md flex flex-col">
          <h2 className="text-lg font-bold mb-4">Slides</h2>
          <button 
            onClick={addSlide} 
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            + Add Slide
          </button>
          <div className="flex flex-col gap-2">
            {slides.map(slide => (
              <div 
                key={slide.id} 
                className={`p-2 border rounded cursor-pointer ${selectedSlide === slide.id ? "bg-blue-300" : "bg-gray-200"}`}
                onClick={() => setSelectedSlide(slide.id)}
              >
                {slide.name}
              </div>
            ))}
          </div>
        </div>

        {/* Main Slide View */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center" style={{ backgroundImage: selectedSlide !== null ? `url(${slides.find(slide => slide.id === selectedSlide)?.background || ''})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          {selectedSlide !== null ? (
            <div className="w-3/4 h-3/4 p-4 text-lg border rounded shadow-md bg-white bg-opacity-80 flex flex-col gap-4">
              <input 
                type="text" 
                value={slides.find(slide => slide.id === selectedSlide)?.name || ""} 
                onChange={(e) => updateSlide(selectedSlide, "name", e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Slide Name"
              />
              <textarea
                value={slides.find(slide => slide.id === selectedSlide)?.content || ""}
                onChange={(e) => updateSlide(selectedSlide, "content", e.target.value)}
                className="w-full flex-grow p-2 border rounded"
                placeholder="Slide Content"
              />
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        updateSlide(selectedSlide, "background", event.target.result as string);
                      }
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
                className="w-full p-2 border rounded"
              />
            </div>
          ) : (
            <p className="text-gray-500">Select a slide to edit</p>
          )}
        </div>
      </div>
    </div>
  );
}
