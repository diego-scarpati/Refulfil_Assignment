import { Router } from "express";
import {
  getAllMerchants,
  getMerchantById,
  getMerchantByShopifyId,
  createMerchant,
} from "../controllers/merchant.controllers.js";

/**
 * Router for merchant-related operations.
 * Provides endpoints to retrieve and create merchants.
 */
const router = Router();

/**
 * GET /
 * Returns a list of all merchants.
 */
router.get("/", getAllMerchants);

/**
 * GET /shopify/:shopifyId
 * Returns a merchant by its Shopify ID.
 */
router.get("/shopify/:shopifyId", getMerchantByShopifyId);

/**
 * GET /:id
 * Returns a merchant by database ID.
 */
router.get("/:id", getMerchantById);

/**
 * POST /
 * Creates a new merchant.
 */
router.post("/", createMerchant);

export default router;
