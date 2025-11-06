import { Injectable } from "@nestjs/common";
import { AppLandingResponseDto } from "./app.dto";

@Injectable()
export class AppService {
  constructor() {}

  getLanding(): AppLandingResponseDto {
    return {
      uptimeSeconds: Math.floor(process.uptime()),
      now: new Date().toISOString(),
    };
  }
}
