import { Merchant, Order, OrderItem } from "@/models";
import * as orderService from "./order.services.js";
import { Op } from "sequelize";

/**
 * Retrieve every merchant in the system.
 * @returns A list of {@link Merchant} records.
 */
export const getAllMerchants = async (): Promise<Merchant[]> => {
  try {
    const merchants = await Merchant.findAll();
    return merchants;
  } catch (error) {
    console.error("Error fetching merchants:", error);
    throw error;
  }
};
/**
 * Fetch a merchant by database identifier.
 * @param id - UUID of the merchant.
 * @returns The matching {@link Merchant} record.
 * @throws If the merchant does not exist.
 */
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

/**
 * Retrieve a merchant by its Shopify store identifier.
 * @param shopifyId - The Shopify merchant id.
 * @returns The matching {@link Merchant} record.
 * @throws If the merchant cannot be found.
 */
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

/**
 * Calculate the total order value and number of orders for a merchant.
 * Optionally constrained to a date range.
 * @param merchantId - Merchant identifier.
 * @param startDate - Optional start date.
 * @param endDate - Optional end date.
 * @returns Totals for value and order count.
 */
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

/**
 * Retrieve all orders for a given merchant including their items.
 * @param merchantId - Merchant identifier.
 * @returns Merchant records with associated orders.
 */
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

/**
 * Create a new merchant record.
 * @param data - Merchant attributes.
 * @returns The created {@link Merchant} instance.
 */
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

/**
 * Compute GMV and AOV metrics for a merchant.
 * @param merchantId - Merchant identifier.
 * @returns Gross merchandise value and average order value.
 */
export const getMerchantGMV = async (
  merchantId: string
): Promise<{ gmv: number; aov: number }> => {
  try {
    const orderItems = await OrderItem.findAll({
      include: [
        {
          model: Order,
          as: "order",
          attributes: [],
          where: { merchant_id: merchantId },
        },
      ],
    });

    const amountOfOrders = orderItems.length;
    const gmv = orderItems.reduce((sum, item) => {
      const price = parseFloat(item.dataValues.total_price);
      const tax = parseFloat(item.dataValues.total_tax);
      const discount = parseFloat(item.dataValues.total_discount);
      return sum + price + tax - discount;
    }, 0);
    const aov = amountOfOrders > 0 ? gmv / amountOfOrders : 0;

    return { gmv, aov };
  } catch (error) {
    console.error("Error calculating merchant GMV:", error);
    throw error;
  }
};

/**
 * Compute GMV and AOV for a merchant within a specific date range.
 * @param merchantId - Merchant identifier.
 * @param startDate - Start date of the range.
 * @param endDate - End date of the range.
 */
export const getMerchantGMVByDateRange = async (
  merchantId: string,
  startDate: Date,
  endDate: Date
): Promise<{ gmv: number; aov: number }> => {
  try {
    const orderItems = await OrderItem.findAll({
      include: [
        {
          model: Order,
          as: "order",
          attributes: [],
          where: {
            merchant_id: merchantId,
            createdAtcreated_at_by_shopify: {
              [Op.between]: [startDate, endDate],
            },
          },
        },
      ],
    });
    const amountOfOrders = orderItems.length;
    const gmv = orderItems.reduce((sum, item) => {
      const price = parseFloat(item.dataValues.total_price);
      const tax = parseFloat(item.dataValues.total_tax);
      const discount = parseFloat(item.dataValues.total_discount);
      return sum + price + tax - discount;
    }, 0);
    const aov = amountOfOrders > 0 ? gmv / amountOfOrders : 0;

    return { gmv, aov };
  } catch (error) {
    console.error("Error calculating merchant GMV by date range:", error);
    throw error;
  }
};

/**
 * Compute GMV and AOV across all merchants.
 * @returns Aggregated GMV and AOV.
 */
export const getAllGMV = async (): Promise<{ gmv: number; aov: number }> => {
  try {
    const orderItems = await OrderItem.findAll({
      include: [
        {
          model: Order,
          as: "order",
          attributes: [],
        },
      ],
    });

    const amountOfOrders = orderItems.length;
    const gmv = orderItems.reduce((sum, item) => {
      const price = parseFloat(item.dataValues.total_price);
      const tax = parseFloat(item.dataValues.total_tax);
      const discount = parseFloat(item.dataValues.total_discount);
      return sum + price + tax - discount;
    }, 0);
    const aov = amountOfOrders > 0 ? gmv / amountOfOrders : 0;

    return { gmv, aov };
  } catch (error) {
    console.error("Error calculating merchant GMV:", error);
    throw error;
  }
};

/**
 * Compute GMV and AOV across all merchants for a given period.
 * @param startDate - Start date of the range.
 * @param endDate - End date of the range.
 */
export const getAllGMVByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<{ gmv: number; aov: number }> => {
  try {
    const orderItems = await OrderItem.findAll({
      include: [
        {
          model: Order,
          as: "order",
          attributes: [],
          where: {
            createdAtcreated_at_by_shopify: {
              [Op.between]: [startDate, endDate],
            },
          },
        },
      ],
    });
    const amountOfOrders = orderItems.length;
    const gmv = orderItems.reduce((sum, item) => {
      const price = parseFloat(item.dataValues.total_price);
      const tax = parseFloat(item.dataValues.total_tax);
      const discount = parseFloat(item.dataValues.total_discount);
      return sum + price + tax - discount;
    }, 0);
    const aov = amountOfOrders > 0 ? gmv / amountOfOrders : 0;

    return { gmv, aov };
  } catch (error) {
    console.error("Error calculating merchant GMV by date range:", error);
    throw error;
  }
};

/**
 * Retrieve every merchant with its computed GMV and AOV.
 * @returns Array of merchants and their metrics.
 */
export const getAllMerchantsWithGMV = async (): Promise<
  Array<{ merchant: Merchant; gmv: number; aov: number }>
> => {
  try {
    const merchants = await Merchant.findAll();
    const merchantsWithGMV = await Promise.all(
      merchants.map(async (merchant) => {
        const { gmv, aov } = await getMerchantGMV(merchant.dataValues.id);
        return { merchant, gmv, aov };
      })
    );
    return merchantsWithGMV;
  } catch (error) {
    console.error("Error fetching merchants with GMV:", error);
    throw error;
  }
};
