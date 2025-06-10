import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { SystemSetting } from '../system-settings/entities/system-setting.entity';
import { UsersModule } from '../users/users.module';
import { SystemSettingsModule } from '../system-settings/system-settings.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SystemSetting]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    UsersModule,
    SystemSettingsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
