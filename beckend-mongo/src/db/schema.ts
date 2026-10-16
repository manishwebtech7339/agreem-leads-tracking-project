import mongoose, { Schema, Types } from "mongoose";

// User Interface & Schema
export interface IUser {
  name: string;
  email: string;
  gender: string;
  password: string;
  salt: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    gender: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model<IUser>("User", userSchema);

// Lead Interface & Schema
export interface ILead {
  name: string;
  email: string;
  phone?: string;
  status: "new" | "contacted" | "qualified" | "lost";
  userId: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      required: true,
      enum: ["new", "contacted", "qualified", "lost"],
      default: "new",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Lead = mongoose.model<ILead>("Lead", leadSchema);

// Note Interface & Schema
export interface INote {
  content: string;
  leadId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

const noteSchema = new Schema<INote>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    leadId: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Note = mongoose.model<INote>("Note", noteSchema);
