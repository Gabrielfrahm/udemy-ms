import { ClientProxy } from '@nestjs/microservices';
import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreateCategoryDto } from './dtos/create-category';
import { Observable } from 'rxjs';
import { UpdateCategoryDto } from './dtos/update-category';

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

  @Put('categories/:_id')
  @UsePipes(ValidationPipe)
  updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('_id') _id: string,
  ) {
    this.client.emit('update-category', {
      id: _id,
      category: updateCategoryDto,
    });
  }
}
