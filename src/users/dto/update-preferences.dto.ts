/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePreferencesDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  language?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  theme?: string;
}
