import { DataTypes, Model } from "sequelize";
import sequelize from "../db/db.js";

export default class Merchant extends Model {}

Merchant.init(
  {
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
  },
  {
    tableName: "merchants",
    modelName: "Merchant",
    timestamps: true,
    sequelize,
  }
);
