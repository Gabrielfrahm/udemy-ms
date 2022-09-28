import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePlayerDto {
  @IsNotEmpty()
  readonly phone_number: string;

  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  category: string;
}
