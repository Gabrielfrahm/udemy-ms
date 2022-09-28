import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from 'src/categories/interfaces';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async createPlayer(player: Player): Promise<void> {
    try {
      const createPlayer = new this.playerModel(player);
      await createPlayer.save();
    } catch (error) {
      this.logger.error('error', JSON.stringify(error.message));
      throw new RpcException(error.message);
    }
  }
}