import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Match } from './interfaces/match.interface';
import { MatchService } from './match.service';

const ackErrors: string[] = ['E11000'];

@Controller()
export class MatchController {
  constructor(private readonly matchService: MatchService) {
    this.matchService = matchService;
  }

  @EventPattern('create-match')
  async createMatch(@Payload() match: Match, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.matchService.createMatch(match);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }
}
