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
  processedAt: string | null;
  updatedAt: string;
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
