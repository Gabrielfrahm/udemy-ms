import * as mongoose from 'mongoose';

export const matchSchema = new mongoose.Schema(
  {
    challenger: { type: mongoose.Schema.Types.ObjectId },
    category: { type: String },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    def: { type: mongoose.Schema.Types.ObjectId },
    result: [{ set: { type: String } }],
  },
  { timestamps: true, collection: 'match' },
);
