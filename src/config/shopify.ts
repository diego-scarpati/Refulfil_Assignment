import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";
import { createAdminApiClient } from "@shopify/admin-api-client";

const {
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET,
  SHOPIFY_HOST_NAME,
  SHOPIFY_ACCESS_TOKEN,
} = process.env;

export const shopify = shopifyApi({
  apiKey: SHOPIFY_API_KEY || "",
  apiSecretKey: SHOPIFY_API_SECRET || "",
  scopes: ["read_orders"],
  hostName: SHOPIFY_HOST_NAME || "",
  isEmbeddedApp: true,
  apiVersion: LATEST_API_VERSION,
});

export const adminApiClient = createAdminApiClient({
  storeDomain: SHOPIFY_HOST_NAME || "",
  accessToken: SHOPIFY_ACCESS_TOKEN || "",
  apiVersion: LATEST_API_VERSION,
});
