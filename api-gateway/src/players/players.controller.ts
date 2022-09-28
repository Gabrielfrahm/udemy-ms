import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePlayerDto } from './dtos/create-player.dto';

@Controller('players')
export class PlayersController {
  private logger = new Logger(PlayersController.name);
  constructor(@Inject('PLAYER') private readonly client: ClientProxy) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    this.logger.log('create player', JSON.stringify(createPlayerDto));

    const category = await this.client
      .send('get-categories', createPlayerDto.category)
      .toPromise();

    if (!category) {
      throw new BadRequestException(`category not found!`);
    }
    this.client.emit('create-player', createPlayerDto);
  }
}
