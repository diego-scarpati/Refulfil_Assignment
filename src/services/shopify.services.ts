import { adminApiClient } from "../config/shopify.js";
import {
  FETCH_ORDERS_QUERY,
  FETCH_ORDERS_BY_DATE_RANGE_QUERY,
} from "../utils/shopify/queries.js";
import type {
  OrdersResponse,
  ShopifyOrder,
  FetchOrdersOptions,
} from "../utils/types.js";

/**
 * Fetch all orders from a Shopify merchant
 * @param options Pagination and filtering options
 */
export const fetchAllOrders = async (
  options: FetchOrdersOptions = {}
): Promise<ShopifyOrder[]> => {
  const { first = 250, after, createdAtMin, createdAtMax } = options;
  const allOrders: ShopifyOrder[] = [];
  let hasNextPage = true;
  let cursor = after || null;

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

      const response = await adminApiClient.request<OrdersResponse>(query, {
        variables,
      });

      if (response.data?.orders) {
        const orders = response.data.orders.edges.map((edge) => edge.node);
        allOrders.push(...orders);

        hasNextPage = response.data.orders.pageInfo.hasNextPage;
        cursor = response.data.orders.pageInfo.endCursor;
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
  startDate: Date,
  endDate: Date,
  options: Omit<FetchOrdersOptions, "createdAtMin" | "createdAtMax"> = {}
): Promise<ShopifyOrder[]> => {
  return fetchAllOrders({
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
  days: number = 30
): Promise<ShopifyOrder[]> => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return fetchOrdersByDateRange(startDate, endDate);
};
