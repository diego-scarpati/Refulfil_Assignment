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
  },
  {
    tableName: "orders",
    modelName: "Order",
    timestamps: true,
    sequelize,
  }
);
