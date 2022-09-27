import * as mongoose from 'mongoose';

export const playerSchema = new mongoose.Schema(
  {
    phone_number: { type: String },
    email: { type: String, unique: true },
    name: String,
    ranking: String,
    ranking_position: Number,
    avatar_url: String,
  },
  { timestamps: true, collection: 'players' },
);
