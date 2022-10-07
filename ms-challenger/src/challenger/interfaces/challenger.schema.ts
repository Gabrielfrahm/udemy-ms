import * as mongoose from 'mongoose';

export const ChallengerSchema = new mongoose.Schema(
  {
    challengerTime: { type: Date },
    status: { type: String },
    solicitationTime: { type: Date },
    answerTime: { type: Date },
    category: { type: mongoose.Schema.Types.ObjectId },
    solicitation: { type: mongoose.Schema.Types.ObjectId },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'Player',
      },
    ],
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
    },
  },
  { timestamps: true, collection: 'challenger' },
);
