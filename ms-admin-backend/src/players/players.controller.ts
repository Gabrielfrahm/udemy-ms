import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Player } from 'src/categories/interfaces';
import { PlayersService } from './players.service';

const ackErrors: string[] = ['E11000'];

@Controller('players')
export class PlayersController {
  logger = new Logger(PlayersController.name);
  constructor(private readonly playerService: PlayersService) {}

  @EventPattern('create-player')
  async createPlayer(@Payload() player: Player, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log('player', JSON.stringify(player));

      await this.playerService.createPlayer(player);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }
}
