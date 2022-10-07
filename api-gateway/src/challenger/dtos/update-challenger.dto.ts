import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { StatusChallenger } from '../enum/status-challenger.enum';

export class UpdateChallengerDto {
  @IsOptional()
  @IsEnum(StatusChallenger)
  status: StatusChallenger;
}
