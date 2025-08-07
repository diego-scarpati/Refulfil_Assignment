export const FETCH_ORDERS_QUERY = `
  query fetchOrders($first: Int!, $after: String) {
    orders(first: $first, after: $after) {
      edges {
        cursor
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
          lineItems(first: 100) {
            edges {
              cursor
              node {
                id
                name
                quantity
                originalUnitPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                totalPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                totalDiscountSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                variant {
                  id
                  sku
                  product { id }
                }
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
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
  query fetchOrdersByDateRange(
    $first: Int!
    $after: String
    $query: String
  ) {
    orders(first: $first, after: $after, query: $query) {
      edges {
        cursor
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
          lineItems(first: 100) {
            edges {
              cursor
              node {
                id
                name
                quantity
                originalUnitPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                totalPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                totalDiscountSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                variant {
                  id
                  sku
                  product { id }
                }                
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
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
