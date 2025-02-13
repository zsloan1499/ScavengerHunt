'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation

export default function ScavengerHuntHintDetails() {
  const [slides, setSlides] = useState<{ 
    id: number; 
    name: string; 
    hints: { id: number; content: string }[]; 
    background: string; 
  }[]>([]);
  const [selectedSlide, setSelectedSlide] = useState<number | null>(null);
  const [selectedHintIndex, setSelectedHintIndex] = useState<number | null>(null);
  const router = useRouter(); // Initialize useRouter from next/navigation

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
    const newSlide = { 
      id: Date.now(), 
      name: `Location #${slides.length + 1}`, 
      hints: [{ id: Date.now(), content: "New Hint" }], 
      background: "" 
    };
    setSlides([...slides, newSlide]);
    setSelectedSlide(newSlide.id);
    setSelectedHintIndex(0); // Start at the first hint of the new slide
  };

  const addHintToSlide = (slideId: number) => {
    const newHint = { id: Date.now(), content: "New Hint" };
    setSlides(slides.map(slide =>
      slide.id === slideId ? { ...slide, hints: [...slide.hints, newHint] } : slide
    ));

    // After adding the new hint, stay on the same slide and move to the new hint
    const currentSlide = slides.find(slide => slide.id === selectedSlide);
    if (currentSlide) {
      setSelectedHintIndex(currentSlide.hints.length); // Move to the next hint on the current slide
    }
  };

  const updateHint = (slideId: number, hintId: number, value: string) => {
    setSlides(slides.map(slide => 
      slide.id === slideId ? {
        ...slide, 
        hints: slide.hints.map(hint => 
          hint.id === hintId ? { ...hint, content: value } : hint
        ) 
      } : slide
    ));
  };

  const deleteSlide = (id: number) => {
    const newSlides = slides.filter(slide => slide.id !== id);
    setSlides(newSlides);
    if (selectedSlide === id) {
      setSelectedSlide(newSlides.length > 0 ? newSlides[Math.max(0, newSlides.findIndex(slide => slide.id === id) - 1)]?.id : null);
      setSelectedHintIndex(-1); // Reset selectedHintIndex when deleting a slide
    }
  };

  const goToNextHint = () => {
    if (selectedSlide !== null && selectedHintIndex !== null) {
      const slide = slides.find(slide => slide.id === selectedSlide);
      if (slide && selectedHintIndex < slide.hints.length - 1) {
        setSelectedHintIndex(selectedHintIndex + 1);
      }
    }
  };
  
  const goToPreviousHint = () => {
    if (selectedSlide !== null && selectedHintIndex !== null) {
      if (selectedHintIndex > 0) {
        setSelectedHintIndex(selectedHintIndex - 1);
      }
    }
  };

  const changeBackground = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
  
      // Prepare form data to send to the backend
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error("File upload failed");
        }
  
        const data = await response.json();
        const fileUrl = data.url; // The pre-signed URL of the uploaded image
  
        // Update the selected slide's background using the file URL
        setSlides((prevSlides) =>
          prevSlides.map((slide) =>
            slide.id === selectedSlide ? { ...slide, background: fileUrl } : slide
          )
        );
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const deleteHint = (slideId: number, hintId: number) => {
    setSlides(slides.map(slide => {
      if (slide.id === slideId) {
        // Remove the hint from the current slide
        const newHints = slide.hints.filter(hint => hint.id !== hintId);
        
        // Renumber the hints
        const updatedHints = newHints.map((hint, index) => ({
          ...hint,
          id: Date.now(), // Reset the hint ID (optional, depends on your preference)
          content: hint.content, // Retain the content
        }));

        return { ...slide, hints: updatedHints };
      }
      return slide;
    }));

    // If the last hint is deleted, go to the previous hint or first one
    if (selectedHintIndex === slide.hints.length - 1) {
      setSelectedHintIndex(selectedHintIndex > 0 ? selectedHintIndex - 1 : 0);
    }
  };

  // Safe access to selected slide and hints
  const selectedSlideData = selectedSlide !== null ? slides.find(slide => slide.id === selectedSlide) : null;
  const selectedHint = selectedSlideData?.hints[selectedHintIndex ?? -1];

  // Submit function to send the scavenger hunt data and navigate to home page
  const submitFunction = async () => {
    try {
      // Get hunt data from localStorage
      const huntData = JSON.parse(localStorage.getItem("scavengerHuntData") || '{}');
      
      const selectedSlides = slides.map(slide => ({
        hints: slide.hints,
        background: slide.background, // Send the background URL
      }));
  
      const response = await fetch("/api/submitScavengerHunt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: huntData.name, // Set the title to the name from huntData
          slides: selectedSlides,
          tags: huntData.tags, // Include tags
          location: huntData.location, // Include location
          isPrivate: huntData.isPrivate, // Include isPrivate
          password: huntData.password, // Include password
          background: selectedSlides.length > 0 ? selectedSlides[0].background : "", // Global background (if applicable)
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("Scavenger Hunt Submitted Successfully", data);
        
        // Clear local storage before navigating
        localStorage.clear();
        
        router.push("/"); // Navigate to home page after successful submission
      } else {
        console.error("Failed to submit scavenger hunt", data);
      }
    } catch (error) {
      console.error("Error submitting scavenger hunt", error);
    }
  };
  
  

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      {/* Navigation Bar */}
      <nav className="w-full bg-black text-white py-5 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Create a Scavenger Hunt</h1>
        <Link href="/">
          <button
            onClick={() => {
              localStorage.clear(); // Clear all local storage items
            }}
            className="text-white bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
          >
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
            + New Location
          </button>
          <div className="flex flex-col gap-2">
            {slides.map(slide => (
              <div key={slide.id} className="relative w-full">
                <button 
                  className={`w-full p-2 border rounded cursor-pointer ${selectedSlide === slide.id ? "bg-blue-300" : "bg-gray-200"}`}
                  onClick={() => {
                    setSelectedSlide(slide.id);
                    setSelectedHintIndex(0); // Reset to the first hint when switching slides
                  }}
                >
                  {slide.name}
                </button>
                
                {/* Delete button positioned at the top right of the slide */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click from triggering the slide change
                    deleteSlide(slide.id);
                  }}
                  className="absolute top-0 right-0 text-red-500 hover:text-red-700 p-1"
                >
                  X
                </button>
                
                {/* Change Background Button */}
                <label htmlFor={`change-background-${slide.id}`} className="absolute bottom-0 left-0 text-white bg-black text-xs py-1 px-3 cursor-pointer rounded-tl-md">
                  Change Background
                </label>
                <input
                  type="file"
                  id={`change-background-${slide.id}`}
                  onChange={changeBackground}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button 
            onClick={submitFunction}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            Submit
          </button>
        </div>

        {/* Main Slide View */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center relative">
          {selectedSlide !== null && selectedHintIndex !== null ? (
            <div 
              className="w-3/4 h-3/4 p-4 text-lg border rounded shadow-md bg-white bg-opacity-80 flex flex-col justify-center items-center"
              style={{
                backgroundImage: `url(${selectedSlideData?.background || ''})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Centered Hint Title */}
              <div className="text-center font-bold text-2xl mb-4">
                Hint #{selectedHintIndex + 1}
              </div>

              {/* Centered and Justified Textbox */}
              <textarea
                value={selectedHint?.content || ""}
                onChange={(e) => updateHint(selectedSlide ?? -1, selectedHint?.id ?? -1, e.target.value)}
                className="w-full flex-grow p-4 border rounded resize-none text-center whitespace-pre-wrap text-justify bg-transparent border-gray-300 text-gray-700"
                placeholder="Hint Content"
              />
              <button 
                onClick={() => addHintToSlide(selectedSlide ?? -1)} 
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                + New Hint
              </button>

              {/* Add Delete Hint Button */}
              <button 
                onClick={() => deleteHint(selectedSlide ?? -1, selectedHint?.id ?? -1)} 
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2">
                Delete Hint
              </button>
            </div>
          ) : (
            <p className="text-gray-500">Select a slide to edit</p>
          )}

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 ml-2">
            <button 
              onClick={goToPreviousHint} 
              disabled={selectedHintIndex === 0} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:bg-gray-200">
              &lt;
            </button>
          </div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 mr-2">
            <button 
              onClick={goToNextHint} 
              disabled={selectedSlide === null || selectedHintIndex === (selectedSlideData?.hints.length ?? 0) - 1} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:bg-gray-200">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
