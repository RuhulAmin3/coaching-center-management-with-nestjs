import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { apiResponse } from 'src/utils/api-response';

@Controller('/leaderboard')
@ApiTags('Leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  @ApiCreatedResponse()
  @ApiOperation({ description: 'monthly leaderboard endpoints' })
  async addAttendence(@Query() query: Record<string, any>) {
    const result = await this.leaderboardService.getMonthlyLeaderboard(query);
    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'monthly leaderboard retrieved successfully',
    });
    return response;
  }
}
