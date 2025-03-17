import mongoose from "mongoose";
import { Node } from "../models/node.model.js"; 
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost/gyanpath", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected for seeding");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Sample data
const sampleNodes = [
  {
    nodeId: "1",
    name: "Room 101",
    coordinates: { x: 10, y: 10, floor: 1 },
    type: "room",
    connections: [{ nodeId: "2", distance: 5 }],
  },
  {
    nodeId: "2",
    name: "Hallway",
    coordinates: { x: 15, y: 10, floor: 1 },
    type: "hallway",
    connections: [
      { nodeId: "1", distance: 5 },
      { nodeId: "3", distance: 3 },
    ],
  },
  {
    nodeId: "3",
    name: "Stairs",
    coordinates: { x: 15, y: 15, floor: 1 },
    type: "stair",
    connections: [
      { nodeId: "2", distance: 3 },
      { nodeId: "4", distance: 0 }, // Floor transition
    ],
  },
  {
    nodeId: "4",
    name: "Stairs (Floor 2)",
    coordinates: { x: 15, y: 15, floor: 2 },
    type: "stair",
    connections: [
      { nodeId: "3", distance: 0 },
      { nodeId: "5", distance: 5 },
    ],
  },
  {
    nodeId: "5",
    name: "Room 201",
    coordinates: { x: 20, y: 15, floor: 2 },
    type: "room",
    connections: [{ nodeId: "4", distance: 5 }],
  },
];

// Insert function
const seedDB = async () => {
  try {
    // Optional: Pehle existing data delete karo (testing ke liye)
    await Node.deleteMany({});
    console.log("Existing nodes deleted");

    // Sample data insert karo
    await Node.insertMany(sampleNodes);
    console.log("Sample data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    mongoose.connection.close(); // Connection band karo
    console.log("MongoDB connection closed");
  }
};

// Run the script
const runSeed = async () => {
  await connectDB();
  await seedDB();
};

runSeed();