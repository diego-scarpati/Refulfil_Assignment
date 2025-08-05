import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

export const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  shopify_order_id: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  total_price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: "orders",
  timestamps: false,
});
