import ScavengerHuntModel from "../../models/ScavengerHuntModel";
import connectToDatabase from "../../../lib/mongodb";

export async function GET(req) {
  try {
    await connectToDatabase();

    // Get the 'id' parameter from the request URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ message: "ID is required" }),
        { status: 400 }
      );
    }

    // Find the specific scavenger hunt by its ID
    const hunt = await ScavengerHuntModel.findById(id);

    if (!hunt) {
      return new Response(
        JSON.stringify({ message: "Scavenger Hunt not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify(hunt),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching scavenger hunt:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching scavenger hunt", error }),
      { status: 500 }
    );
  }
}
