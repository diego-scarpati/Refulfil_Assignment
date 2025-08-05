export const FETCH_ORDERS_QUERY = `
  query fetchOrders($first: Int!, $after: String) {
    orders(first: $first, after: $after) {
      edges {
        node {
          id
          name
          createdAt
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          financialStatus
          fulfillmentStatus
          processedAt
          updatedAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const FETCH_ORDERS_BY_DATE_RANGE_QUERY = `
  query fetchOrdersByDateRange($first: Int!, $after: String, $createdAtMin: DateTime, $createdAtMax: DateTime) {
    orders(first: $first, after: $after, query: "created_at:>='$createdAtMin' created_at:<='$createdAtMax'") {
      edges {
        node {
          id
          name
          createdAt
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          financialStatus
          fulfillmentStatus
          processedAt
          updatedAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

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