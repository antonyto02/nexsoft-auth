import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SystemSettingsService } from './system-settings.service';
import { UpdateConfigDto } from './dto/update-config.dto';

@UseGuards(JwtAuthGuard)
@Controller('auth/config')
export class SystemSettingsController {
  constructor(private readonly service: SystemSettingsService) {}

  @Get()
  async getConfig() {
    const settings = await this.service.getConfig();
    if (!settings) {
      return {};
    }
    return {
      logo_url: settings.logo_url,
      color_primary: settings.color_primary,
      color_secondary: settings.color_secondary,
      color_tertiary: settings.color_tertiary,
      company_name: settings.nombre,
    };
  }

  @Patch()
  async update(@Body() dto: UpdateConfigDto) {
    const settings = await this.service.updateColors(dto);
    return {
      message: 'Configuración actualizada correctamente',
      settings: {
        logo_url: settings.logo_url,
        color_primary: settings.color_primary,
        color_secondary: settings.color_secondary,
        color_tertiary: settings.color_tertiary,
        company_name: settings.nombre,
      },
    };
  }

  @Get('upload-url')
  async getSignedUrl(@Query('type') type: string, @Query('ext') ext: string) {
    const result = await this.service.getSignedUrl(type, ext);
    return {
      upload_url: result.upload_url,
      final_url: result.final_url,
    };
  }
}
