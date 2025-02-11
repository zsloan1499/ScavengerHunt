import connectToDatabase from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ message: "Connected to MongoDB successfully!" });
  } catch (error) {
    return NextResponse.json({ message: "Error connecting to database", error: error.message }, { status: 500 });
  }
}
