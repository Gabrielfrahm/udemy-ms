import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { AwsService } from 'src/aws/aws.service';
import { ValidationParamPipe } from 'src/common/pipes/validationParam.pipe';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Controller('players')
export class PlayersController {
  private logger = new Logger(PlayersController.name);
  constructor(
    @Inject('PLAYER') private readonly client: ClientProxy,
    private awsService: AwsService,
  ) {
    this.awsService = awsService;
  }

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

  @Post('/:_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async fileUpload(@UploadedFile() file, @Param('_id') _id: string) {
    const player = await this.client.send('get-players', _id).toPromise();
    if (!player) {
      throw new NotFoundException(`Player not Found`);
    }

    const playerAvatar = await this.awsService.fileUpload(file, _id);

    const updatePlayerDto: UpdatePlayerDto = {};
    updatePlayerDto.avatar_url = playerAvatar.url;

    await this.client.emit('update-player', {
      id: _id,
      player: updatePlayerDto,
    });

    return this.client.send('get-players', _id);
  }

  @Delete('/:_id')
  async deletePlayer(@Param('_id', ValidationParamPipe) _id: string) {
    await this.client.emit('delete-player', { _id });
  }
}
