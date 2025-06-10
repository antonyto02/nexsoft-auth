import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSetting } from './entities/system-setting.entity';
import { UpdateConfigDto } from './dto/update-config.dto';
import { AwsS3Service } from '../shared/aws-s3.service';

@Injectable()
export class SystemSettingsService {
  constructor(
    @InjectRepository(SystemSetting)
    private settingsRepo: Repository<SystemSetting>,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async getConfig() {
    return this.settingsRepo.findOne({ where: { nombre: 'global' } });
  }

  async updateColors(dto: UpdateConfigDto) {
    const settings = await this.settingsRepo.findOne({ where: { nombre: 'global' } });
    if (!settings) throw new NotFoundException('Settings not found');
    settings.color_primary = dto.color_primary;
    settings.color_secondary = dto.color_secondary;
    settings.color_tertiary = dto.color_tertiary;
    await this.settingsRepo.save(settings);
    return settings;
  }

  async getSignedUrl(type: string, ext: string) {
    return this.awsS3Service.generateUploadUrl(type, ext);
  }
}
