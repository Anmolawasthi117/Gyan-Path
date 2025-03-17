import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { Node } from "../models/node.model.js";
import { calculatePath, formatRoute } from "../utils/pathfinding.js";

// Get all nodes
const getAllNodes = asyncHandler(async (req, res) => {
  const nodes = await Node.find();
  return res
    .status(200)
    .json(new ApiResponse(200, nodes, "All nodes fetched successfully"));
});

// Get node by ID
const getNodeById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const node = await Node.findOne({ nodeId: id });
  if (!node) {
    return res.status(404).json(new ApiResponse(404, null, "Node not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, node, "Node fetched successfully"));
});

// Get route between two nodes
const getRoute = asyncHandler(async (req, res) => {
  const { startId, endId } = req.body;

  const nodes = await Node.find();
  const startNode = nodes.find((n) => n.nodeId === startId);
  const endNode = nodes.find((n) => n.nodeId === endId);

  if (!startNode) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, `Start node '${startId}' not found`));
  }
  if (!endNode) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, `End node '${endId}' not found`));
  }

  const path = calculatePath(nodes, startNode, endNode);
  if (path.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No path found between nodes"));
  }

  const route = formatRoute(path);
  return res
    .status(200)
    .json(new ApiResponse(200, route, "Route calculated successfully"));
});

// Add new node
const addNode = asyncHandler(async (req, res) => {
  const { nodeId, name, coordinates, type, connections } = req.body;

  // Check if nodeId already exists
  const existingNode = await Node.findOne({ nodeId });
  if (existingNode) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, `Node ID '${nodeId}' already exists`));
  }

  const node = await Node.create({
    nodeId,
    name,
    coordinates,
    type,
    connections: connections || [],
  });

  return res.status(201).json(new ApiResponse(201, node, "Node created successfully"));
});

// Update node
 const updateNode = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, coordinates, type, connections } = req.body;

  const node = await Node.findOne({ nodeId: id });
  if (!node) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, `Node '${id}' not found`));
  }

  node.name = name || node.name;
  node.coordinates = coordinates || node.coordinates;
  node.type = type || node.type;
  node.connections = connections || node.connections;

  await node.save();

  return res.status(200).json(new ApiResponse(200, node, "Node updated successfully"));
});

// Delete node
const deleteNode = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const node = await Node.findOneAndDelete({ nodeId: id });
  if (!node) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, `Node '${id}' not found`));
  }

  // Optional: Remove references from other nodes' connections
  await Node.updateMany(
    { "connections.nodeId": id },
    { $pull: { connections: { nodeId: id } } }
  );

  return res.status(200).json(new ApiResponse(200, null, "Node deleted successfully"));
});

const searchNodes = asyncHandler(async (req, res) => {
  const { name } = req.query;

  // Fetch nodes with case-insensitive partial match
  const nodes = await Node.find({
    name: { $regex: new RegExp(name, "i") },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, nodes, "Nodes found successfully"));
});

export { getAllNodes, getNodeById, getRoute, addNode, updateNode, deleteNode,searchNodes, };

