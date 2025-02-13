'use client'
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ScavengerHuntDetails() {
  const params = useParams();
  const id = params?.id;
  const [hunt, setHunt] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(0);
  const [selectedHintIndex, setSelectedHintIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchHuntDetails = async () => {
      try {
        const response = await fetch(`/api/getDisplayScavengerHunt?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setHunt(data);
        } else {
          console.error("Failed to fetch scavenger hunt details.");
        }
      } catch (error) {
        console.error("Error fetching hunt details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHuntDetails();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!hunt) return <p className="text-center mt-10">Scavenger Hunt not found.</p>;

  const handleNextLocation = () => {
    if (selectedLocationIndex < hunt.locations.length - 1) {
      setSelectedLocationIndex(selectedLocationIndex + 1);
      setSelectedHintIndex(0); // Reset to the first hint of the new location
    }
  };

  const handlePreviousLocation = () => {
    if (selectedLocationIndex > 0) {
      setSelectedLocationIndex(selectedLocationIndex - 1);
      setSelectedHintIndex(0); // Reset to the first hint of the previous location
    }
  };

  const handleNextHint = () => {
    if (selectedHintIndex < hunt.locations[selectedLocationIndex].hints.length - 1) {
      setSelectedHintIndex(selectedHintIndex + 1);
    }
  };

  const handlePreviousHint = () => {
    if (selectedHintIndex > 0) {
      setSelectedHintIndex(selectedHintIndex - 1);
    }
  };

  const selectedLocation = hunt.locations[selectedLocationIndex];
  const selectedHint = selectedLocation?.hints[selectedHintIndex];

  // Dynamically update the background image based on the selected location
  const backgroundImageUrl = selectedLocation?.photos?.[0] || "No URL"; // Default if no photo available

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100">
      {/* Navigation Header */}
      <nav className="w-full bg-black text-white py-5 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">{hunt.title}</h1>
        <Link href="/">
          <button className="text-white bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition">
            Back
          </button>
        </Link>
      </nav>

      {/* Main Display */}
      <div className="w-full mt-6 p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
        {/* Background Image or Default White Background */}
        <div
          className={`w-full h-[calc(100vh-50vh)] relative rounded-lg shadow-md bg-center ${selectedLocation?.photos?.length > 0 ? 'bg-cover' : 'bg-white'}`}
          style={{
            backgroundImage: selectedLocation?.photos?.length > 0 ? `url(${selectedLocation.photos[0]})` : 'none',
            backgroundSize: selectedLocation?.photos?.length > 0 ? 'cover' : 'auto',
            backgroundPosition: selectedLocation?.photos?.length > 0 ? 'center' : 'unset',
          }}
        >
          {/* Slide Content */}
          <div className="flex flex-col items-center justify-center w-full h-full absolute inset-0 bg-transparent">
            {/* Location Title */}
            <h2 className="text-3xl font-bold mb-4">{`Location #${selectedLocationIndex + 1}`}</h2>

            {/* Hint Content */}
            <div className="w-full text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">{`Hint #${selectedHintIndex + 1}`}</h3>
              <p className="text-lg">{selectedHint}</p>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 ml-4">
              <button 
                onClick={handlePreviousLocation} 
                disabled={selectedLocationIndex === 0} 
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:bg-gray-200">
                &lt;
              </button>
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 mr-4">
              <button 
                onClick={handleNextLocation} 
                disabled={selectedLocationIndex === hunt.locations.length - 1} 
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:bg-gray-200">
                &gt;
              </button>
            </div>
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 ml-12">
              <button 
                onClick={handlePreviousHint} 
                disabled={selectedHintIndex === 0} 
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:bg-gray-200">
                &#8592;
              </button>
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 mr-12">
              <button 
                onClick={handleNextHint} 
                disabled={selectedHintIndex === selectedLocation.hints.length - 1} 
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:bg-gray-200">
                &#8594;
              </button>
            </div>
          </div>
        </div>

        {/* Visibility */}
        <div className="mt-6 text-center">
          <p><strong>Visibility:</strong> {hunt.isPublic ? "Public" : "Private"}</p>
          {!hunt.isPublic && hunt.password && (
            <p><strong>Password:</strong> {hunt.password}</p>
          )}
        </div>
      </div>
    </div>
  );
}
