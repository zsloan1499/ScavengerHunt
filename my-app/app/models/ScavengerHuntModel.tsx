import mongoose, { Schema, Document } from "mongoose";

// Define the structure for a single location in the hunt
interface Location {
  hints: string[]; // List of hint texts
  photos: string[]; // List of photo URLs for the location
}

// Define the scavenger hunt model interface
export interface IScavengerHunt extends Document {
  title: string;
  tags: string[];
  locations: Location[];
  backgroundPhoto: string;
  isPublic: boolean;
  password?: string; // Only required if isPublic is false
}

// Define the schema for ScavengerHunt
const scavengerHuntSchema: Schema = new Schema({
  title: { type: String, required: true },
  tags: { type: [String], default: [] },
  locations: [
    {
      hints: { type: [String], default: [] },
      photos: { type: [String], default: [] },
    },
  ],
  backgroundPhoto: { type: String, required: true },
  isPublic: { type: Boolean, required: true, default: true },
  password: { type: String, required: function (this: IScavengerHunt) { return !this.isPublic; } },
});

// Create or reuse the model
const ScavengerHuntModel =
  mongoose.models.ScavengerHunt ||
  mongoose.model<IScavengerHunt>("ScavengerHunt", scavengerHuntSchema);

export default ScavengerHuntModel;
