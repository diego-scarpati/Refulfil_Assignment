import {
  FETCH_ORDERS_QUERY,
  FETCH_ORDERS_BY_DATE_RANGE_QUERY,
} from "../utils/shopify/queries.js";
import type {
  OrdersResponse,
  ShopifyOrder,
  FetchOrdersOptions,
} from "../utils/types.js";
import { createShopifyClient } from "../config/shopify.js";
import type { Key } from "@/models/";

/**
 * Fetch all orders from a Shopify merchant
 * @param options Pagination and filtering options
 */
export const fetchAllOrders = async (
  client: Key,
  options: FetchOrdersOptions = {}
): Promise<ShopifyOrder[]> => {
  const { first = 250, after, createdAtMin, createdAtMax } = options;
  const allOrders: ShopifyOrder[] = [];
  let hasNextPage = true;
  let cursor = after || null;

  const shopifyClient = await createShopifyClient(client);

  try {
    while (hasNextPage) {
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

      // const response = await adminApiClient.request<OrdersResponse>(query, {
      //   variables,
      // });

      const response = await shopifyClient.query<OrdersResponse>({
        data: {
          query,
          variables,
        },
      });

      if (response.body?.orders) {
        const orders = response.body.orders.edges.map((edge) => edge.node);
        allOrders.push(...orders);

        hasNextPage = response.body.orders.pageInfo.hasNextPage;
        cursor = response.body.orders.pageInfo.endCursor;
      } else {
        hasNextPage = false;
      }

      // Add delay to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 500));
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
): Promise<ShopifyOrder[]> => {
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
): Promise<ShopifyOrder[]> => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return fetchOrdersByDateRange(client, startDate, endDate);
};
