import { Merchant, Order } from "@/models";
import * as orderService from "./order.services.js";

export const getAllMerchants = async (): Promise<Merchant[]> => {
  try {
    const merchants = await Merchant.findAll();
    return merchants;
  } catch (error) {
    console.error("Error fetching merchants:", error);
    throw error;
  }
};
export const getMerchantById = async (id: string): Promise<Merchant> => {
  try {
    const merchant = await Merchant.findByPk(id);
    if (!merchant) {
      throw new Error(`Merchant with ID ${id} not found`);
    }
    return merchant;
  } catch (error) {
    console.error("Error fetching merchant:", error);
    throw error;
  }
};

export const getMerchantByShopifyId = async (
  shopifyId: string
): Promise<Merchant> => {
  try {
    const merchant = await Merchant.findOne({
      where: { shopify_id: shopifyId },
    });
    if (!merchant) {
      throw new Error(`Merchant with Shopify ID ${shopifyId} not found`);
    }
    return merchant;
  } catch (error) {
    console.error("Error fetching merchant:", error);
    throw error;
  }
};

export const getMerchantOrdersAmount = async (
  merchantId: string,
  startDate?: Date,
  endDate?: Date
) => {
  try {
    const { totalValue, amountOfOrders } =
      await orderService.getMerchantOrdersAmount(
        merchantId,
        startDate,
        endDate
      );
    return { totalValue, amountOfOrders };
  } catch (error) {
    console.error("Error fetching merchant orders amount:", error);
    throw error;
  }
};

export const getAllMerchantOrders = async (merchantId: string) => {
  try {
    const merchants = await Merchant.findAll({
      where: { id: merchantId },
      include: {
        model: Order,
        as: "orders",
      },
    });
    return merchants;
  } catch (error) {
    console.error("Error fetching merchants orders:", error);
    throw error;
  }
};

export const createMerchant = async (data: {
  name: string;
  shopify_id: string;
}): Promise<Merchant> => {
  try {
    const merchant = await Merchant.create(data);
    return merchant;
  } catch (error) {
    console.error("Error creating merchant:", error);
    throw error;
  }
};
