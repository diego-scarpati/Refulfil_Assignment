import { Merchant } from "@/models";

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
