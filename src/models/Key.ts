import { DataTypes, Model } from "sequelize";
import sequelize from "../db/db.js";

export default class Key extends Model {}

Key.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    merchant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    api_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    api_secret_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    host_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    access_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    }
  },
  {
    tableName: "keys",
    modelName: "Key",
    timestamps: true,
    sequelize,
  }
);