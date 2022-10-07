import { Player } from 'src/players/interfaces/player.interface';

export interface Match {
  category?: string;
  desafio?: string;
  players?: Player[];
  def?: Player;
  result?: Result[];
}

export interface Result {
  set: string;
}
