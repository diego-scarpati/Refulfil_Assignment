import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";
import { createAdminApiClient } from "@shopify/admin-api-client";
import type { Key } from "@/models";

const { SHOPIFY_HOST_NAME, SHOPIFY_ACCESS_TOKEN } = process.env;

export const adminApiClient = createAdminApiClient({
  storeDomain: SHOPIFY_HOST_NAME || "",
  accessToken: SHOPIFY_ACCESS_TOKEN || "",
  apiVersion: LATEST_API_VERSION,
});

export const shopify = (
  apiKey: string,
  apiSecretKey: string,
  hostName: string
) => {
  return shopifyApi({
    apiKey,
    apiSecretKey,
    hostName,
    scopes: ["read_orders"],
    isEmbeddedApp: true,
    apiVersion: LATEST_API_VERSION,
  });
};

export const createShopifyClient = async (client: Key) => {
  const shopifyObject = shopify(
    client.dataValues.api_key,
    client.dataValues.api_secret_key,
    client.dataValues.host_name
  );

  const session = shopifyObject.session.customAppSession(
    client.dataValues.host_name
  );

  const shopifyClient = new shopifyObject.clients.Graphql({
    session,
  });

  return shopifyClient
};
