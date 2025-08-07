import type {
  NewOrder,
  OrderCreatorObject,
  OrderItemCreatorObject,
} from "./types";
import * as shopifyService from "@/services/shopify.services";
import { createOrder } from "@/services/order.services";
import { createOrderItem } from "@/services/orderItem.services";
import type { Order, Key } from "@/models";
import { getAllActiveKeys } from "@/services/key.services";

/**
 * Fetch all orders for a given Shopify client and persist them with their line items.
 * @param client - Merchant API key configuration.
 * @returns The number of newly created orders and the records themselves.
 */
export const fetchAndCreateOrders = async (
  client: Key
): Promise<{ amount: number; created: Order[] }> => {
  const orders: NewOrder[] = await shopifyService.fetchAllOrders(client);
  const ordersOnDB = await Promise.all(
    orders.map(async (order) => {
      const { order: createdOrder, created } = await createOrder({
        shopify_order_id: order.shopify_order_id,
        total_price: parseFloat(order.total_price),
        created_at: new Date(order.created_at_by_shopify),
        merchant_id: order.merchant_id,
        financial_status: order.financial_status,
        fulfillment_status: order.fulfillment_status,
        processed_at: order.processed_at,
        updated_at_by_shopify: order.updated_at_by_shopify,
        shopify_name: order.shopify_name,
      } as OrderCreatorObject);
      // Create order items
      await Promise.all(
        order.items.map(async (item) => {
          await createOrderItem({
            order_id: createdOrder.dataValues.id,
            shopify_line_item_id: item.shopify_line_item_id,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
            currency_code: item.currency_code,
            created_at_by_shopify: item.created_at_by_shopify,
            sku: item.sku,
            product_id: item.product_id,
            variant_id: item.variant_id,
            total_discount: item.total_discount,
            total_tax: item.total_tax,
          } as OrderItemCreatorObject);
        })
      );
      return { createdOrder, created };
    })
  );
  const createdOrders = {
    amount: ordersOnDB.filter((order) => order.created).length,
    created: ordersOnDB
      .filter((order) => order.created)
      .map((order) => order.createdOrder),
  };
  return createdOrders;
};

/**
 * Fetch orders within a date range for a client and persist them.
 * @param client - Merchant API key configuration.
 * @param startDate - Start of the period.
 * @param endDate - End of the period.
 */
export const fetchAndCreateOrdersByDateRange = async (
  client: Key,
  startDate: Date,
  endDate: Date
): Promise<{ amount: number; created: Order[] }> => {
  const orders: NewOrder[] = await shopifyService.fetchOrdersByDateRange(
    client,
    startDate,
    endDate
  );
  const ordersOnDB = await Promise.all(
    orders.map(async (order) => {
      const { order: createdOrder, created } = await createOrder({
        shopify_order_id: order.shopify_order_id,
        total_price: parseFloat(order.total_price),
        created_at: new Date(order.created_at_by_shopify),
        merchant_id: order.merchant_id,
        financial_status: order.financial_status,
        fulfillment_status: order.fulfillment_status,
        processed_at: order.processed_at,
        updated_at_by_shopify: order.updated_at_by_shopify,
        shopify_name: order.shopify_name,
      } as OrderCreatorObject);
      // Create order items
      await Promise.all(
        order.items.map(async (item) => {
          await createOrderItem({
            order_id: createdOrder.dataValues.id,
            shopify_line_item_id: item.shopify_line_item_id,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
            currency_code: item.currency_code,
            created_at_by_shopify: item.created_at_by_shopify,
            sku: item.sku,
            product_id: item.product_id,
            variant_id: item.variant_id,
            total_discount: item.total_discount,
            total_tax: item.total_tax,
          } as OrderItemCreatorObject);
        })
      );
      return { createdOrder, created };
    })
  );
  const createdOrders = {
    amount: ordersOnDB.filter((order) => order.created).length,
    created: ordersOnDB
      .filter((order) => order.created)
      .map((order) => order.createdOrder),
  };
  return createdOrders;
};

/**
 * Iterate through all active merchants and import their orders for the scheduler window.
 */
export const loopForScheduler = async (startDate: Date, endDate: Date) => {
  const clients = await getAllActiveKeys();
  for (const client of clients) {
    await fetchAndCreateOrdersByDateRange(client, startDate, endDate);
  }
};
