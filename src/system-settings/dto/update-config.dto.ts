import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateConfigDto {
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
