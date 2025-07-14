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

  async getConfig(companyId: string) {
    return this.settingsRepo.findOne({ where: { id: companyId } });
  }

  async updateColors(dto: UpdateConfigDto, companyId: string) {
    const settings = await this.settingsRepo.findOne({ where: { id: companyId } });
    if (!settings) throw new NotFoundException('Settings not found');
    if (dto.logo_url !== undefined) {
      settings.logo_url = dto.logo_url;
    }
    if (dto.color_primary !== undefined) {
      settings.color_primary = dto.color_primary;
    }
    if (dto.color_secondary !== undefined) {
      settings.color_secondary = dto.color_secondary;
    }
    if (dto.color_tertiary !== undefined) {
      settings.color_tertiary = dto.color_tertiary;
    }
    if (dto.newName !== undefined) {
      settings.nombre = dto.newName;
    }
    await this.settingsRepo.save(settings);
    return settings;
  }

  async getSignedUrl(type: string, ext: string) {
    return this.awsS3Service.generateUploadUrl(type, ext);
  }
}
