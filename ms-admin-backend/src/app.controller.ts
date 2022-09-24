import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { Category } from './interfaces';

const ackErrors: string[] = ['E11000'];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: Category,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(category);
    try {
      await this.appService.createCategory(category);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(error.message);
      ackErrors.map(async (ackError) => {
        if (error.message.includes(ackError)) {
          await channel.ack(originalMsg);
        }
      });
    }
  }

  @MessagePattern('get-categories')
  async getCategories(@Payload() _id: string) {
    if (!_id) {
      return await this.appService.getAllCategories();
    }
    return await this.appService.getCategoryById(_id);
  }
}
