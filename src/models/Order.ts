import { DataTypes, Model } from "sequelize";
import sequelize from "../db/db.js";

export default class Order extends Model {}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    shopify_order_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    total_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    created_at_by_shopify: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    financial_status: { type: DataTypes.STRING },
    fulfillment_status: { type: DataTypes.STRING },
    processed_at: { type: DataTypes.DATE },
    updated_at_by_shopify: { type: DataTypes.DATE },
    shopify_name: { type: DataTypes.STRING }, // e.g. “#1001”
  },
  {
    tableName: "orders",
    modelName: "Order",
    timestamps: true,
    sequelize,
  }
);
