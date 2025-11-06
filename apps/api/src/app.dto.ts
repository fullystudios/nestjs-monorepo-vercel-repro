import { ApiProperty } from "@nestjs/swagger";

export class AppLandingResponseDto {
  @ApiProperty({ example: 12345 })
  uptimeSeconds!: number;

  @ApiProperty({ example: new Date().toISOString() })
  now!: string;
}
