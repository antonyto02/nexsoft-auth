import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSetting } from './entities/system-setting.entity';
import { SystemSettingsService } from './system-settings.service';
import { SystemSettingsController } from './system-settings.controller';
import { AwsS3Service } from '../shared/aws-s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([SystemSetting])],
  controllers: [SystemSettingsController],
  providers: [SystemSettingsService, AwsS3Service],
  exports: [TypeOrmModule, SystemSettingsService],
})
export class SystemSettingsModule {}
