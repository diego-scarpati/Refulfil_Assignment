import type { Request, Response } from "express";
import * as merchantServices from "../services/merchant.services.js";

export const getAllMerchants = async (_req: Request, res: Response) => {
  try {
    const merchants = await merchantServices.getAllMerchants();
    return res.json(merchants);
  } catch (error) {
    console.error("Error fetching merchants:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMerchantById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const merchant = await merchantServices.getMerchantById(id);
    return res.json(merchant);
  } catch (error) {
    console.error(`Error fetching merchant with ID ${id}:`, error);
    return res.status(404).json({ error: "Merchant not found" });
  }
};

export const getMerchantByShopifyId = async (req: Request, res: Response) => {
  const { shopifyId } = req.params as { shopifyId: string };
  try {
    const merchant = await merchantServices.getMerchantByShopifyId(shopifyId);
    return res.json(merchant);
  } catch (error) {
    console.error(`Error fetching merchant with Shopify ID ${shopifyId}:`, error);
    return res.status(404).json({ error: "Merchant not found" });
  }
};

export const createMerchant = async (req: Request, res: Response) => {
  const { name, shopifyId } = req.body as { name: string; shopifyId: string };
  try {
    const newMerchant = await merchantServices.createMerchant({
      name,
      shopify_id: shopifyId,
    });
    return res.status(201).json(newMerchant);
  } catch (error) {
    console.error("Error creating merchant:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMerchantGMV = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { startDate, endDate } = req.query as {
    startDate?: string;
    endDate?: string;
  };

  try {
    const result =
      startDate && endDate
        ? await merchantServices.getMerchantGMVByDateRange(
            id,
            new Date(startDate),
            new Date(endDate)
          )
        : await merchantServices.getMerchantGMV(id);

    return res.json(result);
  } catch (error) {
    console.error(`Error fetching GMV for merchant ${id}:`, error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllGMV = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query as {
    startDate?: string;
    endDate?: string;
  };

  try {
    const result =
      startDate && endDate
        ? await merchantServices.getAllGMVByDateRange(
            new Date(startDate),
            new Date(endDate)
          )
        : await merchantServices.getAllGMV();

    return res.json(result);
  } catch (error) {
    console.error("Error fetching GMV:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllMerchantsWithGMV = async (_req: Request, res: Response) => {
  try {
    const merchants = await merchantServices.getAllMerchantsWithGMV();
    return res.json(merchants);
  } catch (error) {
    console.error("Error fetching merchants with GMV:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};