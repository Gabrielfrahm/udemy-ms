import { Player } from 'src/players/interfaces/player.interface';
import { StatusChallenger } from '../enum/status-challenger.enum';

export interface Challenger {
  challengerTime: Date;
  status: StatusChallenger;
  solicitationTime: Date;
  answerTime: Date;
  solicitation: Player;
  category: string;
  players: Player[];
  match?: string;
}
