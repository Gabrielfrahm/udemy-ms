import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusChallenger } from './enum/status-challenger.enum';
import { Challenger } from './interfaces/challenger.interface';

@Injectable()
export class ChallengerService {
  constructor(
    @InjectModel('Challenger')
    private readonly challengerModel: Model<Challenger>,
  ) {}

  async createChallenger(challenger: Challenger): Promise<Challenger> {
    try {
      const createChallenger = new this.challengerModel(challenger);
      createChallenger.solicitationTime = new Date();

      createChallenger.status = StatusChallenger.PENDENTE;

      return await createChallenger.save();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async getAllChallengers(): Promise<Challenger[]> {
    try {
      return await this.challengerModel.find().exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async getChallengerPlayer(_id: any): Promise<Challenger[] | Challenger> {
    try {
      return await this.challengerModel.find().where('players').in(_id).exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async getChallengerById(_id: any): Promise<Challenger> {
    try {
      return await this.challengerModel.findOne({ _id }).exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async updateChallenger(_id: string, challenger: Challenger): Promise<void> {
    try {
      challenger.answerTime = new Date();
      await this.challengerModel
        .findOneAndUpdate({ _id }, { $set: challenger })
        .exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async updateChallengerMatch(
    matchId: string,
    challenger: Challenger,
  ): Promise<void> {
    try {
      challenger.status = StatusChallenger.REALIZADO;
      challenger.match = matchId;
      await this.challengerModel
        .findOneAndUpdate({ _id: challenger._id }, { $set: challenger })
        .exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async deleteChallenger(challenger: Challenger): Promise<void> {
    try {
      const { _id } = challenger;

      challenger.status = StatusChallenger.CANCELADO;

      await this.challengerModel
        .findOneAndUpdate({ _id }, { $set: challenger })
        .exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
