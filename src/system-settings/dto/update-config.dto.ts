import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateConfigDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  logo_url?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(100)
  company_name?: string;

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
