import ScavengerHuntModel from "../../models/ScavengerHuntModel";
import connectToDatabase from "../../../lib/mongodb";

// Handle POST requests
export async function POST(req) {
    try {
      // Ensure database connection is established
      await connectToDatabase();
  
      const { title, slides, background } = await req.json(); // Parse JSON from the request body
  
      // Structure the data for the scavenger hunt
      const scavengerHuntData = {
        title,
        tags: [], // Add any tags if needed
        locations: slides.map(slide => ({
          hints: slide.hints.map(hint => hint.content), // Extract the hint texts
          photos: slide.background ? [slide.background] : [], // Only add the background photo if it exists
        })),
        backgroundPhoto: background || "", // Can be used as a global background or per slide, default to empty string
        isPublic: true, // Set based on your requirements
        password: "", // Optional password field
      };
  
      // Save the scavenger hunt in the database
      const newScavengerHunt = new ScavengerHuntModel(scavengerHuntData);
      await newScavengerHunt.save();
  
      // Return a response directly in the new Next.js format
      return new Response(
        JSON.stringify({ message: "Scavenger hunt created successfully" }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error creating scavenger hunt", error);
  
      // Return error response directly
      return new Response(
        JSON.stringify({ message: "Error creating scavenger hunt", error }),
        { status: 500 }
      );
    }
  }
  
  // Handle methods other than POST (optional)
  export function OPTIONS() {
    return new Response(JSON.stringify({ message: "Options request received" }), {
      status: 200,
    });
  }