import {
  FETCH_ORDERS_QUERY,
  FETCH_ORDERS_BY_DATE_RANGE_QUERY,
} from "../utils/shopify/queries.js";
import type {
  OrdersResponse,
  FetchOrdersOptions,
  NewOrder,
} from "../utils/types.js";
import { createShopifyClient } from "../config/shopify.js";
import type { Key } from "@/models/";
import { mapShopifyToNewOrders } from "@/utils/shopify/helperFunctions.js";

/**
 * Fetch all orders from a Shopify merchant
 * @param options Pagination and filtering options
 */
export const fetchAllOrders = async (
  client: Key,
  options: FetchOrdersOptions = {}
): Promise<NewOrder[]> => {
  const { first = 250, after, createdAtMin, createdAtMax } = options;
  const allOrders: NewOrder[] = [];
  let hasNextPage = true;
  let cursor = after || null;

  const shopifyClient = await createShopifyClient(client);

  try {
    while (hasNextPage) {
    // pick the right query
    const query =
      createdAtMin && createdAtMax
        ? FETCH_ORDERS_BY_DATE_RANGE_QUERY
        : FETCH_ORDERS_QUERY;

    const variables = {
      first,
      after: cursor,
      ...(createdAtMin && { createdAtMin }),
      ...(createdAtMax && { createdAtMax }),
    };

    // fetch a page
    const response = await shopifyClient.query<OrdersResponse>({
      data: { query, variables },
    });
    const body = response.body;
    if (!body?.orders) break;

    // map that page into NewOrder[], each with its items[]
    const { orders: pageOrders } = mapShopifyToNewOrders(body, client.dataValues.merchant_id);
    allOrders.push(...pageOrders);

    // advance pagination
    hasNextPage = body.orders.pageInfo.hasNextPage;
    cursor      = body.orders.pageInfo.endCursor;

    // rate-limit courtesy
    await new Promise((r) => setTimeout(r, 500));
  }

    console.log(`✅ Fetched ${allOrders.length} orders from Shopify`);
    return allOrders;
  } catch (error) {
    console.error("❌ Error fetching orders from Shopify:", error);
    throw new Error(
      `Failed to fetch orders: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

/**
 * Fetch orders from a specific date range
 * @param startDate Start date of the range
 * @param endDate End date of the range
 * @param options Additional options for pagination
 */
export const fetchOrdersByDateRange = async (
  client: Key,
  startDate: Date,
  endDate: Date,
  options: Omit<FetchOrdersOptions, "createdAtMin" | "createdAtMax"> = {}
): Promise<NewOrder[]> => {
  return fetchAllOrders(client, {
    ...options,
    createdAtMin: startDate.toISOString(),
    createdAtMax: endDate.toISOString(),
  });
};

/**
 * Fetch recent orders (last N days) with default of 30 days
 * @param days Number of days to look back
 */
export const fetchRecentOrders = async (
  client: Key,
  days: number = 30
): Promise<NewOrder[]> => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return fetchOrdersByDateRange(client, startDate, endDate);
};
