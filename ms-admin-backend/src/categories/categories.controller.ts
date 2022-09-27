import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { Category } from './interfaces';

const ackErrors: string[] = ['E11000'];

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  private readonly logger = new Logger(CategoriesController.name);

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: Category,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(category);
    try {
      await this.categoriesService.createCategory(category);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(error.message);
      const filterArcErrors = ackErrors.filter((ack) =>
        error.message.includes(ack),
      );
      if (filterArcErrors) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('get-categories')
  async getCategories(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (!_id) {
        return await this.categoriesService.getAllCategories();
      }
      return await this.categoriesService.getCategoryById(_id);
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('update-category')
  async updateCategory(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    this.logger.log(data);
    try {
      const _id: string = data.id;
      const category: Category = data.category;
      await this.categoriesService.updateCategory(_id, category);
    } catch (error) {
      this.logger.error(error.message);
      const filterArcErrors = ackErrors.filter((ack) =>
        error.message.includes(ack),
      );
      if (filterArcErrors) {
        await channel.ack(originalMsg);
      }
    }
  }
}
