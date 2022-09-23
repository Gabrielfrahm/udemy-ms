import { Document } from 'mongoose';
import { Player } from 'src/interfaces/player/player.interface';

export interface Category extends Document {
  readonly category: string;
  description: string;
  events: Event[];
  players: Player[];
}

export interface Event {
  name: string;
  operation: string;
  value: number;
}
