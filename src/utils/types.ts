export interface ShopifyOrder {
  id: string;
  name: string;
  createdAt: string;
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  financialStatus: string;
  fulfillmentStatus: string | null;
  lineItems: {
    edges: Array<{
      cursor: string;
      node: ShopifyLineItem;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
    };
  };
  processedAt: string | null;
  updatedAt: string;
}

export interface ShopifyLineItem {
  id: string;
  name: string;
  quantity: number;
  originalUnitPriceSet: { shopMoney: { amount: string; currencyCode: string } };
  totalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
  totalDiscountSet: { shopMoney: { amount: string; currencyCode: string } };
  variant?: { id: string; sku?: string; product: { id: string } };
}

export interface OrdersResponse {
  orders: {
    edges: Array<{
      node: ShopifyOrder;
      cursor: string;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
    };
  };
}

export interface FetchOrdersOptions {
  first?: number;
  after?: string;
  createdAtMin?: string;
  createdAtMax?: string;
}

export interface OrderItemAttributes {
  id?: string;
  order_id?: string; // FK → orders.id
  shopify_line_item_id: string; // Shopify's lineItem GID
  name: string; // product/variant name
  quantity: number; // units sold
  unit_price: string; // price per unit (as string for DECIMAL)
  total_price: string; // line total (quantity × unit price minus discounts)
  currency_code: string; // ISO currency code (e.g. "USD")
  created_at_by_shopify: Date; // timestamp of creation in Shopify
  sku?: string; // SKU if available
  product_id?: string; // Shopify product GID (optional)
  variant_id?: string; // Shopify variant GID (optional)
  total_discount?: string; // total discounts on this line
  total_tax?: string; // tax applied on this line
  created_at?: Date; // record created timestamp (Sequelize)
  updated_at?: Date; // record updated timestamp (Sequelize)
}

export interface NewOrder {
  shopify_order_id: string;
  total_price: string;
  created_at_by_shopify: Date;
  merchant_id: string;
  rawNode: ShopifyOrder;
  items: OrderItemAttributes[];
  financial_status?: string | undefined;
  fulfillment_status?: string | undefined;
  processed_at?: Date | undefined;
  updated_at_by_shopify?: Date | undefined;
  shopify_name?: string | undefined;
}

export interface OrderCreatorObject {
  shopify_order_id: string;
  total_price: number;
  created_at: Date;
  merchant_id: string;
  financial_status?: string;
  fulfillment_status?: string;
  processed_at?: Date;
  updated_at_by_shopify?: Date;
  shopify_name?: string;
}

export interface OrderItemCreatorObject {
  order_id: string;
  shopify_line_item_id: string;
  name: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  currency_code: string;
  created_at_by_shopify: Date;
  sku?: string;
  product_id?: string;
  variant_id?: string;
  total_discount?: string;
  total_tax?: string;
  created_at?: Date;
  updated_at?: Date;
}