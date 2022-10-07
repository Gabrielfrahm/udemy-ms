import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenger } from 'src/challenger/interfaces/challenger.interface';
import { Match } from './interfaces/match.interface';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    @Inject('CHALLENGER') private readonly challengerClient: ClientProxy,
  ) {}

  async createMatch(match: Match): Promise<Match> {
    try {
      const createMatch = new this.matchModel(match);

      const result = await createMatch.save();

      const matchId = result._id;

      const challenger: Challenger = await this.challengerClient
        .send('get-challengers', { playerId: '', _id: match.challenger })
        .toPromise();

      return await this.challengerClient
        .emit('update-challenger-match', {
          matchId: matchId,
          challenger: challenger,
        })
        .toPromise();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
