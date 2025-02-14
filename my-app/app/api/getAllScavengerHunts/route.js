import ScavengerHuntModel from "../../models/ScavengerHuntModel";
import connectToDatabase from "../../../lib/mongodb";

// Handle GET requests
export async function GET() { 
  try {
    // Ensure database connection is established
    await connectToDatabase();

    // Fetch all scavenger hunts from the database
    const scavengerHunts = await ScavengerHuntModel.find({});

    // Return the scavenger hunts data
    return new Response(
      JSON.stringify(scavengerHunts),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching scavenger hunts", error);

    // Return error response
    return new Response(
      JSON.stringify({ message: "Error fetching scavenger hunts", error }),
      { status: 500 }
    );
  }
}

// Handle methods other than GET (optional)
export function OPTIONS() {
  return new Response(JSON.stringify({ message: "Options request received" }), {
    status: 200,
  });
}
