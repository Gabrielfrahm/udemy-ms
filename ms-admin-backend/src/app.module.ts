import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/admin_back'),
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
