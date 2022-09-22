import { ClientProxy } from '@nestjs/microservices';
import {
  Body,
  Controller,
  Inject,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreateCategoryDto } from './dtos/create-category';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);

  constructor(@Inject('CATEGORY') private readonly client: ClientProxy) {}

  @Post('categories')
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.client.emit('create-category', createCategoryDto);
  }
}
