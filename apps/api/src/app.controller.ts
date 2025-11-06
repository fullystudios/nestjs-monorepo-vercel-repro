import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AppLandingResponseDto } from "./app.dto";
import { AppService } from "./app.service";

@ApiTags("App")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    operationId: "getLanding",
    summary: "Landing endpoint with service metadata",
  })
  @ApiOkResponse({ type: AppLandingResponseDto })
  getLanding(): AppLandingResponseDto {
    return this.appService.getLanding();
  }
}
