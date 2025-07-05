import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsUUID()
  role_id: string;

  @IsBoolean()
  is_active: boolean;
}
