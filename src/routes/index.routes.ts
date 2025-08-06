import { Router } from "express";
import keyRoutes from "./key.routes.js";
import merchantRoutes from "./merchant.routes.js";
import orderRoutes from "./order.routes.js";

/**
 * Aggregates all route modules and exposes a single router.
 * Each sub-router handles endpoints for a specific resource.
 */
const router = Router();

/**
 * Routes for API key operations.
 */
router.use("/keys", keyRoutes);

/**
 * Routes for merchant operations.
 */
router.use("/merchants", merchantRoutes);

/**
 * Routes for order operations.
 */
router.use("/orders", orderRoutes);

export default router;
