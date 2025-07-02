/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateConfigDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  logo_url?: string;

  @IsString()
  @IsNotEmpty()
  color_primary: string;

  @IsString()
  @IsNotEmpty()
  color_secondary: string;

  @IsString()
  @IsNotEmpty()
  color_tertiary: string;
}
