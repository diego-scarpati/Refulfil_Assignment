import { Router } from "express";
import {
  getAllMerchants,
  getMerchantById,
  getMerchantByShopifyId,
  createMerchant,
  getMerchantGMV,
  getAllGMV,
  getAllMerchantsWithGMV,
} from "../controllers/merchant.controllers.js";

/**
 * Router for merchant-related operations.
 * Provides endpoints to retrieve and create merchants and to access GMV metrics.
 */
const router = Router();

/**
 * GET /
 * Returns a list of all merchants.
 */
router.get("/", getAllMerchants);

/**
 * GET /gmv
 * Returns total GMV and AOV across all merchants.
 * Optional query params `startDate` and `endDate` filter by date range.
 */
router.get("/gmv", getAllGMV);

/**
 * GET /gmv/merchants
 * Returns GMV and AOV for each merchant.
 */
router.get("/gmv/merchants", getAllMerchantsWithGMV);

/**
 * GET /:id/gmv
 * Returns GMV and AOV for a specific merchant.
 * Optional query params `startDate` and `endDate` filter by date range.
 */
router.get("/:id/gmv", getMerchantGMV);

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
