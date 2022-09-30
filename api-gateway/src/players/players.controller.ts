import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ValidationParamPipe } from 'src/common/pipes/validationParam.pipe';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';

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

  @Get()
  getPlayers(@Query('player_id') _id: string): Observable<any> {
    return this.client.send('get-players', _id ? _id : '');
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('_id', ValidationParamPipe) _id: string,
  ) {
    const category = await this.client
      .send('get-categories', updatePlayerDto.category)
      .toPromise();

    if (category) {
      await this.client.emit('update-player', {
        id: _id,
        player: updatePlayerDto,
      });
    } else {
      throw new BadRequestException(`category doest exist!`);
    }
  }

  @Delete('/:_id')
  async deletePlayer(@Param('_id', ValidationParamPipe) _id: string) {
    await this.client.emit('delete-player', { _id });
  }
}
