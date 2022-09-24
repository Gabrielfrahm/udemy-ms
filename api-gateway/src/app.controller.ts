import { ClientProxy } from '@nestjs/microservices';
import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreateCategoryDto } from './dtos/create-category';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);

  constructor(@Inject('CATEGORY') private readonly client: ClientProxy) {}

  @Post('categories')
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    this.client.emit('create-category', createCategoryDto);
  }

  @Get('categories')
  getCategoryById(@Query('category_id') _id: string): Observable<any> {
    return this.client.send('get-categories', _id ? _id : '');
  }
}
