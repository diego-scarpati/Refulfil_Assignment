import { OrderItem } from "@/models";
import type { OrderItemCreatorObject } from "@/utils/types";

export const getAllOrderItems = async (): Promise<OrderItem[]> => {
  try {
    const orderItems = await OrderItem.findAll();
    return orderItems;
  } catch (error) {
    console.error("Error fetching order items:", error);
    throw error;
  }
};

export const getOrderItemsByOrderId = async (
  orderId: string
): Promise<OrderItem[]> => {
  try {
    const orderItems = await OrderItem.findAll({
      where: { order_id: orderId },
    });
    if (!orderItems.length) {
      throw new Error(`No order items found for Order ID ${orderId}`);
    }
    return orderItems;
  } catch (error) {
    console.error(`Error fetching order items for Order ID ${orderId}:`, error);
    throw error;
  }
};

export const createOrderItem = async (data: OrderItemCreatorObject): Promise<OrderItem> => {
  try {
    const newOrderItem = await OrderItem.create({
      ...data,
      unit_price: data.unit_price.toString(),
      total_price: data.total_price.toString(),
      total_discount: data.total_discount
        ? data.total_discount.toString()
        : undefined,
      total_tax: data.total_tax ? data.total_tax.toString() : undefined,
    });
    return newOrderItem;
  } catch (error) {
    console.error("Error creating order item:", error);
    throw error;
  }
};
