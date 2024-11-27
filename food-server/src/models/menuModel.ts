import mongoose, { Document, Schema } from "mongoose";

// Enum for Nigerian delicacy categories
export enum NigerianDelicacyCategory {
  SOUPS = "Soups",
  RICE_DISHES = "Rice Dishes",
  SWALLOWS = "Swallows",
  MAIN_COURSE = "Main Course",
  STEWS = "Stews",
  GRILLED = "Grilled",
  DRINKS = "Drinks",
  DESSERTS = "Desserts",
  APPETIZERS = "Appetizer",
}

// Interface for menu items
export interface IMenu {
  name: string;
  description: string;
  price: number;
  image: string;
  category: NigerianDelicacyCategory;
}

// Document interface
export interface IMenuDocument extends IMenu, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Combined menu schema
const menuSchema = new Schema<IMenuDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive number"],
    },    
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(NigerianDelicacyCategory),
      required: true,
    },
  },
  { timestamps: true }
);

export const Menu = mongoose.model<IMenuDocument>("Menu", menuSchema);
