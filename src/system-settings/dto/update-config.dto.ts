import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateConfigDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  logo_url?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  color_primary?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  color_secondary?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  color_tertiary?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  newName?: string;
}
