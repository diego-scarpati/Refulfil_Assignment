import { Key } from "@/models";

/**
 * Retrieve every API key stored in the database.
 * @returns A list of {@link Key} records.
 */
export const getAllKeys = async (): Promise<Key[]> => {
  try {
    const keys = await Key.findAll();
    return keys;
  } catch (error) {
    console.error("Error fetching keys:", error);
    throw error;
  }
};

/**
 * Retrieve API keys that are currently marked as active.
 * @returns A list of active {@link Key} records.
 */
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

/**
 * Look up a key by its database identifier.
 * @param id - Primary key of the key record.
 * @returns The matching {@link Key} instance.
 * @throws If the key does not exist.
 */
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

/**
 * Find the key belonging to a specific merchant.
 * @param merchantId - The merchant identifier to search for.
 * @returns The matching {@link Key} instance.
 * @throws If no key is found for the merchant.
 */
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

/**
 * Persist a new key used to authenticate against Shopify.
 * @param data - Key attributes to store.
 * @returns The created {@link Key} instance.
 */
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
