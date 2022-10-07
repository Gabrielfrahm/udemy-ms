import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateCategoryDto } from 'src/categories/dtos/update-category';
import { Player } from 'src/players/interfaces/player.interface';

import { CreateChallengerDto } from './dtos/create-challenger.dto';
import { IncludesChallengerMatchDto } from './dtos/includes-challenger-match.dto';
import { StatusChallenger } from './enum/status-challenger.enum';
import { Challenger } from './interfaces/challenger.interface';
import { Match } from './interfaces/match.interface';
import { StatusChallengerValidation } from './pipes/status-challenger-validation.pipe';

@Controller('challenger')
export class ChallengerController {
  constructor(
    @Inject('PLAYER') private readonly playerClient: ClientProxy,
    @Inject('CATEGORY') private readonly categoryClient: ClientProxy,
    @Inject('CHALLENGER') private readonly challengerClient: ClientProxy,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenger(@Body() createChallengerDto: CreateChallengerDto) {
    const players: Player[] = await this.playerClient
      .send('get-players', '')
      .toPromise();

    createChallengerDto.players.map((item) => {
      const playerFilter: Player[] = players.filter(
        (item2) => item2._id == item._id,
      );

      if (playerFilter.length == 0) {
        throw new NotFoundException('player not found');
      }

      if (playerFilter[0].category != createChallengerDto.category) {
        throw new NotFoundException('player no includes in this category');
      }
    });

    const checkPlayerMatch: Player[] = createChallengerDto.players.filter(
      (item) => item._id == createChallengerDto.solicitation,
    );

    if (checkPlayerMatch.length == 0) {
      throw new NotFoundException('Player need incudes into the match');
    }

    const category = await this.categoryClient
      .send('get-categories', createChallengerDto.category)
      .toPromise();

    if (!category) {
      throw new NotFoundException('category not found');
    }

    await this.challengerClient.emit('create-challenger', createChallengerDto);
  }

  @Get()
  async getChallenger(@Query('playerId') playerId: string): Promise<any> {
    if (playerId) {
      const player: Player = await this.playerClient
        .send('get-players', playerId)
        .toPromise();
      if (!player) {
        throw new NotFoundException('Player not found');
      }
    }

    return this.playerClient
      .send('get-challengers', { playerId: playerId, _id: '' })
      .toPromise();
  }

  @Put('/:challenger')
  async updateChallenger(
    @Body(StatusChallengerValidation) updateCategoryDto: UpdateCategoryDto,
    @Param('challenger') _id: string,
  ) {
    const challenger: Challenger = await this.challengerClient
      .send('get-challengers', { playerId: '', _id: _id })
      .toPromise();

    if (!challenger) {
      throw new NotFoundException('challenger not found');
    }

    if (challenger.status != StatusChallenger.PENDENTE) {
      throw new BadRequestException(
        'only challenger with pendente status can updated',
      );
    }
    await this.challengerClient.emit('update-challenger', {
      id: _id,
      challenger: updateCategoryDto,
    });
  }

  @Post('/:challenger/match/')
  async includesChallengerMatch(
    @Body(ValidationPipe)
    includesChallengerMatchDto: IncludesChallengerMatchDto,
    @Param('challenger') _id: string,
  ) {
    const challenger: Challenger = await this.challengerClient
      .send('get-challengers', { playerId: '', _id: _id })
      .toPromise();

    if (!challenger) {
      throw new NotFoundException(`challenger not found`);
    }

    if (challenger.status == StatusChallenger.REALIZADO) {
      throw new BadRequestException(`challenger status already realizado!`);
    }

    if (challenger.status != StatusChallenger.ACEITO) {
      throw new BadRequestException(
        `Matches can only be played in challenges accepted by opponents!`,
      );
    }

    if (!challenger.players.includes(includesChallengerMatchDto.def)) {
      throw new BadRequestException(
        `winner player need includes in the match!`,
      );
    }

    const match: Match = {};
    match.category = challenger.category;
    match.def = includesChallengerMatchDto.def;
    match.desafio = _id;
    match.players = challenger.players;
    match.result = includesChallengerMatchDto.result;

    await this.challengerClient.emit('create-match', match);
  }

  @Delete('/:_id')
  async deleteChallenger(@Param('_id') _id: string) {
    const challenger: Challenger = await this.challengerClient
      .send('consultar-desafios', { idJogador: '', _id: _id })
      .toPromise();

    if (!challenger) {
      throw new NotFoundException(`challenger not found!`);
    }

    await this.challengerClient.emit('delete-challenger', challenger);
  }
}
