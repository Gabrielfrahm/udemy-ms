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
@Controller('categories')
export class CategoriesController {
  private logger = new Logger(CategoriesController.name);

  constructor(@Inject('CATEGORY') private readonly client: ClientProxy) {}

  @Post()
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    this.client.emit('create-category', createCategoryDto);
  }

  @Get()
  getCategoryById(@Query('category_id') _id: string): Observable<any> {
    return this.client.send('get-categories', _id ? _id : '');
  }

  @Put(':_id')
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
