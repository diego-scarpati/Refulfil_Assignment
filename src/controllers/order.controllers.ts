import type { Request, Response } from "express";
import * as orderServices from "../services/order.services.js";

/**
 * Return every order in the database.
 */
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await orderServices.getAllOrders();
    return res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Retrieve a single order by its database identifier.
 */
export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const order = await orderServices.getOrderById(id);
    return res.json(order);
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    return res.status(404).json({ error: "Order not found" });
  }
};

/**
 * Retrieve an order using its Shopify order ID.
 */
export const getOrderByShopifyOrderId = async (req: Request, res: Response) => {
  const { shopifyOrderId } = req.params as { shopifyOrderId: string };
  try {
    const order = await orderServices.getOrderByShopifyOrderId(shopifyOrderId);
    return res.json(order);
  } catch (error) {
    console.error(
      `Error fetching order with Shopify Order ID ${shopifyOrderId}:`,
      error
    );
    return res.status(404).json({ error: "Order not found" });
  }
};

/**
 * Return the most recently created order.
 */
export const getLastOrder = async (_req: Request, res: Response) => {
  try {
    const order = await orderServices.getLastOrder();
    if (!order) {
      return res.status(404).json({ error: "No orders found" });
    }
    return res.json(order);
  } catch (error) {
    console.error("Error fetching last order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Create a new order record.
 */
export const createOrder = async (req: Request, res: Response) => {
  const { shopify_order_id, total_price, created_at, merchant_id } =
    req.body as {
      shopify_order_id: string;
      total_price: number;
      created_at: Date;
      merchant_id: string;
    };

  try {
    const newOrder = await orderServices.createOrder({
      shopify_order_id,
      total_price,
      created_at: new Date(created_at),
      merchant_id,
    });
    return res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

