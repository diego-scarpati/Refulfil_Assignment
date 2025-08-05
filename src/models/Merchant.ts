import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

export const Merchant = sequelize.define("Merchant", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  shopify_id: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: "merchants",
  timestamps: true,
});
