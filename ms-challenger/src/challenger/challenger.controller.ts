import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ChallengerService } from './challenger.service';
import { Challenger } from './interfaces/challenger.interface';
const ackErrors: string[] = ['E11000'];

@Controller()
export class ChallengerController {
  constructor(private readonly challengerService: ChallengerService) {
    this.challengerService = challengerService;
  }

  @EventPattern('create-challenger')
  async createChallenger(
    @Payload() challenger: Challenger,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.challengerService.createChallenger(challenger);
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

  @MessagePattern('get-challengers')
  async getChallengers(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<Challenger[] | Challenger> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const { playerId, _id } = data;

      if (playerId) {
        return await this.challengerService.getChallengerPlayer(playerId);
      } else if (_id) {
        return await this.challengerService.getChallengerById(_id);
      } else {
        return await this.challengerService.getAllChallengers();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('update-challenger')
  async updateChallenger(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const _id: string = data.id;
      const challenger: Challenger = data.challenger;
      await this.challengerService.updateChallenger(_id, challenger);
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

  @EventPattern('update-challenger-match')
  async updateChallengerMatch(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const matchId: string = data.matchId;
      const challenger: Challenger = data.challenger;
      await this.challengerService.updateChallengerMatch(matchId, challenger);
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

  @EventPattern('delete-challenger')
  async deleteChallenger(
    @Payload() challenger: Challenger,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.challengerService.deleteChallenger(challenger);
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
