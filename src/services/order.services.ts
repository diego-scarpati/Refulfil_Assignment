import { Order } from "@/models";

export const createOrder = async (data: {
  shopify_order_id: string;
  total_price: number;
  created_at: Date;
  merchant_id: string;
}): Promise<Order> => {
  try {
    const order = await Order.create(data);
    return order;
  } catch (error) {
    console.error("Error creating order:", error);
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

