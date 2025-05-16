import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const nodeSchema = new Schema(
  {
    nodeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    coordinates: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      floor: { type: Number, required: true },
    },
    type: {
      type: String,
      enum: ["room", "hallway", "stair", "elevator"],
      required: true,
    },
    connections: [
      {
        nodeId: { type: String, ref: "Node" },
        distance: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Case-insensitive index on name field
nodeSchema.index({ name: 1 }, { collation: { locale: "en", strength: 2 } });

nodeSchema.plugin(mongooseAggregatePaginate);

export const Node = mongoose.model("Node", nodeSchema);