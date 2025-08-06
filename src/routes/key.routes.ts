import { Router } from "express";
import { createKeyController } from "../controllers/key.controllers.js";

/**
 * Router handling API key related endpoints.
 * Currently provides an endpoint to create merchant keys.
 */
const router = Router();

/**
 * POST /
 * Creates a new API key for a merchant.
 */
router.post("/", createKeyController);

export default router;
