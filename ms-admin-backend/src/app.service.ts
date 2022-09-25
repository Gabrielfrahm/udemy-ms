import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, Player } from './interfaces';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @InjectModel('Category') private readonly playerModel: Model<Player>,
  ) {
    this.categoryModel = categoryModel;
  }

  async createCategory(category: Category): Promise<Category> {
    try {
      const createdCategory = new this.categoryModel(category);
      return await createdCategory.save();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryModel.find().populate('players').exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async getCategoryById(_id: string): Promise<Category> {
    try {
      console.log(_id);
      const findCategory = await this.categoryModel.findOne({ _id }).exec();
      return findCategory;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async updateCategory(_id: string, category: Category): Promise<void> {
    try {
      await this.categoryModel
        .findOneAndUpdate({ _id }, { $set: category })
        .exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
