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
  async monthlyLeaderboard(@Query() query: Record<string, any>) {
    const result = await this.leaderboardService.getMonthlyLeaderboard(query);
    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result,
      message: `${query?.month} leaderboard retrieved successfully`,
    });
    return response;
  }
  @Get('/year')
  @ApiCreatedResponse()
  @ApiOperation({ description: 'Yearly leaderboard endpoints' })
  async yearlyLeaderboard(
    @Query('year') year: string,
    @Query('classId') classId: string,
    @Query('monthLength') monthLength: string,
  ) {
    const result = await this.leaderboardService.getYearlyLeaderboard(
      +year,
      classId,
      +monthLength,
    );
    const response = apiResponse({
      statusCode: HttpStatus.OK,
      data: result,
      message: `${year} leaderboard retrieved successfully`,
    });
    return response;
  }
}
