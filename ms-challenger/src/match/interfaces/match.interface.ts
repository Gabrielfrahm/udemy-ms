import { Document } from 'mongoose';
export interface Match extends Document {
  category: string;
  challenger: string;
  players: string[];
  def: string;
  result: Result[];
}

export interface Result {
  set: string;
}
