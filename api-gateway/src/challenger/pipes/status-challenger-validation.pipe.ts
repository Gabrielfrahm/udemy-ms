import { BadRequestException, PipeTransform } from '@nestjs/common';
import { StatusChallenger } from '../enum/status-challenger.enum';

export class StatusChallengerValidation implements PipeTransform {
  readonly status = [
    StatusChallenger.ACEITO,
    StatusChallenger.NEGADO,
    StatusChallenger.CANCELADO,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.isValidStatus(status)) {
      throw new BadRequestException('status is invalid');
    }
    return value;
  }

  private isValidStatus(status: any) {
    const idx = this.status.indexOf(status);
    return idx !== -1;
  }
}
