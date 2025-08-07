import Merchant from "./Merchant.js";
import Order from "./Order.js";
import Key from "./Key.js";
import OrderItem from "./OrderItem.js";

Merchant.hasMany(Order, { foreignKey: "merchant_id" });
Order.belongsTo(Merchant, { foreignKey: "merchant_id" });

Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });

export { Merchant, Order, Key, OrderItem };
