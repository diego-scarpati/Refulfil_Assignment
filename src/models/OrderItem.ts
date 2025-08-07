import { DataTypes, Model } from "sequelize";
import sequelize from "../db/db.js";
import Order from "./Order.js";

export default class OrderItem extends Model {}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Order, key: "id" },
    },
    shopify_line_item_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    product_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    variant_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(14, 4),
      allowNull: false,
    },
    total_discount: {
      type: DataTypes.DECIMAL(14, 4),
      allowNull: false,
      defaultValue: "0.00",
    },
    total_tax: {
      type: DataTypes.DECIMAL(14, 4),
      allowNull: false,
      defaultValue: "0.00",
    },
    currency_code: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    created_at_by_shopify: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "order_items",
    modelName: "OrderItem",
    sequelize,
    timestamps: true,
    updatedAt: true,
    createdAt: true,
  }
);
