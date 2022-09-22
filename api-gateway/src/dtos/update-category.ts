import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';
import { Event } from './create-category';

export class updateCategoryDto {
  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Event[];
}
