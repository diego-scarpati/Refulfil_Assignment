import type { NewOrder, OrdersResponse, OrderItemAttributes } from "../types";

/**
 * Convert the Shopify GraphQL order response into a list of {@link NewOrder} objects
 * along with their nested line items.
 * @param data - Raw GraphQL response from Shopify.
 * @param merchantId - Merchant identifier to attach to each order.
 */
export function mapShopifyToNewOrders(
  data: OrdersResponse,
  merchantId: string
): { orders: NewOrder[] } {
  const orders: NewOrder[] = [];
  // const items: OrderItemAttributes[] = [];

  data.orders.edges.forEach(({ node: order }) => {
    // 1️⃣ Build order record
    const newOrder: NewOrder = {
      shopify_order_id: order.id,
      total_price: order.totalPriceSet.shopMoney.amount,
      created_at_by_shopify: new Date(order.createdAt),
      merchant_id: merchantId,
      financial_status: order.financialStatus || "unknown",
      fulfillment_status: order.fulfillmentStatus ?? "unknown",
      processed_at: order.processedAt ? new Date(order.processedAt) : undefined,
      updated_at_by_shopify: order.updatedAt ? new Date(order.updatedAt) : undefined,
      shopify_name: order.name,
      rawNode: order,
      items: [], // Will fill in later
    };
    orders.push(newOrder);

    // 2️⃣ Build each line item for that order
    order.lineItems.edges.forEach(({ node: line }) => {
      newOrder.items.push({
        id: "", // ← placeholder, will fill in later
        order_id: "", // ← placeholder, will fill in later
        shopify_line_item_id: line.id,
        name: line.name,
        quantity: line.quantity,
        unit_price: line.originalUnitPriceSet.shopMoney.amount,
        total_price: line.totalPriceSet.shopMoney.amount,
        currency_code: line.originalUnitPriceSet.shopMoney.currencyCode,
        created_at_by_shopify: new Date(order.createdAt),
        sku: line.variant?.sku,
        product_id: line.variant?.product?.id,
        variant_id: line.variant?.id,
        total_discount: line.totalDiscountSet?.shopMoney.amount || "0",
        total_tax: "0", // Shopify GraphQL doesn’t expose per-line tax
      } as OrderItemAttributes);
    });
  });

  return { orders };
}
