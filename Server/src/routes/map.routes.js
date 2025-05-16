import { Router } from "express";
import {
  getAllNodes,
  getNodeById,
  getRoute,
  addNode,
  updateNode,
  deleteNode,
  searchNodes,
} from "../controllers/map.controller.js";
import { body, param, query, validationResult } from "express-validator";
import { verifyJWT } from "../middleware/authMiddleware.js";
const router = Router();

// Common validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode: 400, errors: errors.array(), success: false });
  }
  next();
};

// Route-specific validations
const validateRouteInput = [
  body("startId").isString().notEmpty().withMessage("Start ID must be a non-empty string"),
  body("endId").isString().notEmpty().withMessage("End ID must be a non-empty string"),
  handleValidationErrors,
];

const validateNodeInput = [
  body("nodeId").isString().notEmpty().withMessage("Node ID must be a non-empty string"),
  body("name").isString().notEmpty().withMessage("Name must be a non-empty string"),
  body("coordinates").isObject().withMessage("Coordinates must be an object"),
  body("coordinates.x").isNumeric().withMessage("X coordinate must be a number"),
  body("coordinates.y").isNumeric().withMessage("Y coordinate must be a number"),
  body("coordinates.floor").isNumeric().withMessage("Floor must be a number"),
  body("type")
    .isIn(["room", "hallway", "stair", "elevator"])
    .withMessage("Type must be one of: room, hallway, stair, elevator"),
  handleValidationErrors,
];

// Validation for PUT (optional fields)
const validateNodeUpdate = [
  param("id").isString().notEmpty().withMessage("Node ID must be a non-empty string"),
  body("name").optional().isString().withMessage("Name must be a string"),
  body("coordinates")
    .optional()
    .isObject()
    .withMessage("Coordinates must be an object"),
  body("coordinates.x")
    .optional()
    .isNumeric()
    .withMessage("X coordinate must be a number"),
  body("coordinates.y")
    .optional()
    .isNumeric()
    .withMessage("Y coordinate must be a number"),
  body("coordinates.floor")
    .optional()
    .isNumeric()
    .withMessage("Floor must be a number"),
  body("type")
    .optional()
    .isIn(["room", "hallway", "stair", "elevator"])
    .withMessage("Type must be one of: room, hallway, stair, elevator"),
  handleValidationErrors,
];
// Validation for search
const validateSearch = [
  query("name").isString().notEmpty().withMessage("Name query parameter is required"),
  handleValidationErrors,
];

//  routes
router
  .route("/nodes")
  .get(getAllNodes) // Public
  .post(verifyJWT, validateNodeInput, addNode); // Protected

router
  .route("/nodes/:id")
  .get(getNodeById) // Public
  .put(verifyJWT, validateNodeUpdate, updateNode) // Protected
  .delete(
    param("id").isString().notEmpty().withMessage("Node ID must be a non-empty string"),
    handleValidationErrors,
    verifyJWT,
    deleteNode
  ); // Protected

router.route("/route").post(validateRouteInput, getRoute); // Public
router.route("/search").get(validateSearch, searchNodes);
export default router;