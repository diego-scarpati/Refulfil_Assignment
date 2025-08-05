import { Merchant } from "./Merchant.js";
import { Order } from "./Order.js";

Merchant.hasMany(Order, { foreignKey: "merchant_id" });
Order.belongsTo(Merchant, { foreignKey: "merchant_id" });

export { Merchant, Order };
