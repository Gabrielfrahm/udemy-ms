import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Category } from './interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @EventPattern('create-category')
  async createCategory(@Payload() category: Category) {
    this.logger.log(category);
    this.appService.createCategory(category);
  }

  @MessagePattern('get-categories')
  async getCategories(@Payload() _id: string) {
    if (!_id) {
      return await this.appService.getAllCategories();
    }
    return await this.appService.getCategoryById(_id);
  }
}
