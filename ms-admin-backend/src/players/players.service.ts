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

  async getAllPlayers(): Promise<Player[]> {
    try {
      return await this.playerModel.find().exec();
    } catch (error) {
      this.logger.error('error:', JSON.stringify(error.message));
      throw new RpcException(error.message);
    }
  }

  async getPlayerById(_id: string): Promise<Player> {
    try {
      return await this.playerModel.findOne({ _id }).exec();
    } catch (error) {
      this.logger.error('error', JSON.stringify(error.message));
      throw new RpcException(error.message);
    }
  }

  async updatePlayer(_id: string, player: Player): Promise<void> {
    try {
      await this.playerModel.findOneAndUpdate({ _id }, { $set: player }).exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async deletePlayer(_id: any): Promise<void> {
    try {
      await this.playerModel.deleteOne({ _id }).exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
