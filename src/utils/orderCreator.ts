import type { ShopifyOrder } from "./types";
import * as shopifyService from "@/services/shopify.services";
import { createOrder } from "@/services/order.services";
import type { Order, Key } from "@/models";
import { getAllActiveKeys } from "@/services/key.services";

export const fetchAndCreateOrders = async (
  client: Key
): Promise<{ amount: number; created: Order[] }> => {
  const orders: ShopifyOrder[] = await shopifyService.fetchAllOrders(client);
  const ordersOnDB = await Promise.all(
    orders.map(async (order) => {
      const { order: createdOrder, created } = await createOrder({
        shopify_order_id: order.id,
        total_price: parseFloat(order.totalPriceSet.shopMoney.amount),
        created_at: new Date(order.createdAt),
        merchant_id: order.name, // Assuming merchant_id is derived from order name
      });
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

export const fetchAndCreateOrdersByDateRange = async (
  client: Key,
  startDate: Date,
  endDate: Date
): Promise<{ amount: number; created: Order[] }> => {
  const orders: ShopifyOrder[] = await shopifyService.fetchOrdersByDateRange(
    client,
    startDate,
    endDate
  );
  const ordersOnDB = await Promise.all(
    orders.map(async (order) => {
      const { order: createdOrder, created } = await createOrder({
        shopify_order_id: order.id,
        total_price: parseFloat(order.totalPriceSet.shopMoney.amount),
        created_at: new Date(order.createdAt),
        merchant_id: order.name, // Assuming merchant_id is derived from order name
      });
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

export const loopForScheduler = async (startDate: Date, endDate: Date) => {
  const clients = await getAllActiveKeys();
  for (const client of clients) {
    await fetchAndCreateOrdersByDateRange(
      client,
      startDate,
      endDate
    );
  }
};