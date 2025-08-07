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
      type: DataTypes.STRING,
      allowNull: false,
    },
    shopify_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    partner_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    store_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plan_type: {
      type: DataTypes.ENUM("Basic", "Shopify", "Advanced", "Plus", "Enterprise"),
      allowNull: false,
      defaultValue: "Basic",
    },
    acquisition_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    collaborator_access: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "merchants",
    modelName: "Merchant",
    timestamps: true,
    sequelize,
  }
);
