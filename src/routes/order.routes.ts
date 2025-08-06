import { Router } from "express";
import {
  getAllOrders,
  getOrderById,
  getOrderByShopifyOrderId,
  getLastOrder,
  createOrder,
} from "../controllers/order.controllers.js";

/**
 * Router for order management operations.
 * Exposes endpoints to query and create orders.
 */
const router = Router();

/**
 * GET /
 * Returns a list of all orders.
 */
router.get("/", getAllOrders);

/**
 * GET /shopify/:shopifyOrderId
 * Returns an order by its Shopify order ID.
 */
router.get("/shopify/:shopifyOrderId", getOrderByShopifyOrderId);

/**
 * GET /last
 * Returns the most recently created order.
 */
router.get("/last", getLastOrder);

/**
 * GET /:id
 * Returns an order by database ID.
 */
router.get("/:id", getOrderById);

/**
 * POST /
 * Creates a new order.
 */
router.post("/", createOrder);

export default router;
