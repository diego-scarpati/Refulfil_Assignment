import { Order } from "@/models";
import { Op } from "sequelize";

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const orders = await Order.findAll();
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

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

export const createOrder = async (data: {
  shopify_order_id: string;
  total_price: number;
  created_at: Date;
  merchant_id: string;
}): Promise<{ order: Order; created: boolean }> => {
  try {
    const [order, created] = await Order.findOrCreate({
      where: { shopify_order_id: data.shopify_order_id },
      defaults: data,
    });
    return { order: order, created };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
