import { Key } from "@/models";

export const getAllKeys = async (): Promise<Key[]> => {
  try {
    const keys = await Key.findAll();
    return keys;
  } catch (error) {
    console.error("Error fetching keys:", error);
    throw error;
  }
};

export const getAllActiveKeys = async (): Promise<Key[]> => {
  try {
    const keys = await Key.findAll({
      where: { is_active: true },
    });
    return keys;
  } catch (error) {
    console.error("Error fetching keys:", error);
    throw error;
  }
};

export const getKeyById = async (id: string): Promise<Key> => {
  try {
    const key = await Key.findByPk(id);
    if (!key) {
      throw new Error(`Key with ID ${id} not found`);
    }
    return key;
  } catch (error) {
    console.error("Error fetching key:", error);
    throw error;
  }
};

export const getKeyByMerchantId = async (merchantId: string): Promise<Key> => {
  try {
    const key = await Key.findOne({
      where: { merchant_id: merchantId },
    });
    if (!key) {
      throw new Error(`Key for Merchant ID ${merchantId} not found`);
    }
    return key;
  } catch (error) {
    console.error("Error fetching key by merchant ID:", error);
    throw error;
  }
};

export const createKey = async (data: {
  merchant_id: string;
  shop_domain: string;
  api_key: string;
  api_secret_key: string;
  host_name: string;
  access_token: string;
  valid?: boolean;
}): Promise<Key> => {
  try {
    const newKey = await Key.create(data);
    return newKey;
  } catch (error) {
    console.error("Error creating key:", error);
    throw error;
  }
};
