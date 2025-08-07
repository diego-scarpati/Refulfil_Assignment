import { Order } from "@/models";
import type { OrderCreatorObject } from "@/utils/types";
import { Op } from "sequelize";

/**
 * Retrieve all orders in the database.
 * @returns A list of {@link Order} records.
 */
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const orders = await Order.findAll();
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

/**
 * Fetch a single order by its database identifier.
 * @param id - UUID of the order.
 * @returns The matching {@link Order} instance.
 * @throws If the order does not exist.
 */
export const getOrderById = async (id: string): Promise<Order> => {
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }
    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

/**
 * Retrieve an order using its Shopify order id.
 * @param shopifyOrderId - Shopify's order identifier.
 * @returns The matching {@link Order} instance.
 * @throws If the order cannot be found.
 */
export const getOrderByShopifyOrderId = async (
  shopifyOrderId: string
): Promise<Order> => {
  try {
    const order = await Order.findOne({
      where: { shopify_order_id: shopifyOrderId },
    });
    if (!order) {
      throw new Error(
        `Order with Shopify Order ID ${shopifyOrderId} not found`
      );
    }
    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

/**
 * Get the most recently created order.
 * @returns The newest {@link Order} or null if none exist.
 */
export const getLastOrder = async (): Promise<Order | null> => {
  try {
    const order = await Order.findOne({
      order: [["created_at", "DESC"]],
    });
    return order;
  } catch (error) {
    console.error("Error fetching last order:", error);
    throw error;
  }
};

/**
 * Calculate total order value and count for a merchant within an optional date range.
 * @param merchantId - Merchant identifier.
 * @param startDate - Start of the period.
 * @param endDate - End of the period.
 */
export const getMerchantOrdersAmount = async (
  merchantId: string,
  startDate?: Date,
  endDate?: Date
): Promise<{ totalValue: number; amountOfOrders: number }> => {
  try {
    const orders = await Order.findAll({
      where: {
        merchant_id: merchantId,
        ...(startDate && { created_at: { [Op.gte]: startDate } }),
        ...(endDate && { created_at: { [Op.lte]: endDate } }),
      },
    });
    const totalAmount = orders.reduce(
      (sum, order) => sum + order.dataValues.total_price,
      0
    );
    return { totalValue: totalAmount, amountOfOrders: orders.length };
  } catch (error) {
    console.error("Error fetching merchant orders amount:", error);
    throw error;
  }
};

/**
 * Create a new order if it does not already exist.
 * @param data - Attributes describing the order to create.
 * @returns The created or existing {@link Order} and a flag indicating creation.
 */
export const createOrder = async (data: OrderCreatorObject): Promise<{ order: Order; created: boolean }> => {
  try {
    const [order, created] = await Order.findOrCreate({
      where: { shopify_order_id: data.shopify_order_id },
      defaults: data as any,
    });
    return { order: order, created };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
