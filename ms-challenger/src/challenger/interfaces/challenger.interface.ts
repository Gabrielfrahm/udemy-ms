import { Document } from 'mongoose';
import { StatusChallenger } from '../enum/status-challenger.enum';

export interface Challenger extends Document {
  challengerTime: Date;
  status: StatusChallenger;
  solicitationTime: Date;
  answerTime?: Date;
  solicitation: string;
  category: string;
  players: string[];
  match?: string;
}
