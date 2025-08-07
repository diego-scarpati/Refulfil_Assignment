import type { Request, Response } from "express";
import { createKey } from "../services/key.services.js";

/**
 * Create a new API key for a merchant.
 * Expects all key attributes in the request body.
 */
export const createKeyController = async (req: Request, res: Response) => {
  const { merchant_id, shop_domain, api_key, api_secret_key, host_name, access_token } =
    req.body as {
      merchant_id: string;
      shop_domain: string;
      api_key: string;
      api_secret_key: string;
      host_name: string;
      access_token: string;
    };

  if (
    !merchant_id ||
    !shop_domain ||
    !api_key ||
    !api_secret_key ||
    !host_name ||
    !access_token
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newKey = await createKey({
      merchant_id,
      shop_domain,
      api_key,
      api_secret_key,
      host_name,
      access_token,
      valid: true, // Default to true, can be updated later
    });
    if (!newKey) {
      return res.status(400).json({ error: "Failed to create key" });
    }
    return res.status(201).json("Key created successfully");
  } catch (error) {
    console.error("Error creating key:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
