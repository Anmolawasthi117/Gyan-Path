import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js"; // Updated import
import { body, validationResult } from "express-validator";

const router = Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode: 400, errors: errors.array(), success: false });
  }
  next();
};

// Validation for login (already existing)
const validateLogin = [
  body("username").isString().notEmpty().withMessage("Username is required"),
  body("password").isString().notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Validation for register
const validateRegister = [
  body("username").isString().notEmpty().withMessage("Username is required"),
  body("password")
    .isString()
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
];

// Routes
router.route("/login").post(validateLogin, login);
router.route("/register").post(validateRegister, register); // New route

export default router;