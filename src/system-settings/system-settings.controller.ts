import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SystemSettingsService } from './system-settings.service';
import { UpdateConfigDto } from './dto/update-config.dto';

@UseGuards(JwtAuthGuard)
@Controller('auth/config')
export class SystemSettingsController {
  constructor(private readonly service: SystemSettingsService) {}

  @Get()
  async getConfig(@Req() req: Request) {
    const { companyId } = req.user as { companyId: string };
    const settings = await this.service.getConfig(companyId);
    return (
      settings && {
        logo_url: settings.logo_url,
        color_primary: settings.color_primary,
        color_secondary: settings.color_secondary,
        color_tertiary: settings.color_tertiary,
        company_name: settings.nombre,
      }
    );
  }

  @Patch()
  async update(@Req() req: Request, @Body() dto: UpdateConfigDto) {
    const { companyId } = req.user as { companyId: string };
    const settings = await this.service.updateColors(dto, companyId);
    return {
      message: 'Configuración actualizada correctamente',
      settings: {
        logo_url: settings.logo_url,
        color_primary: settings.color_primary,
        color_secondary: settings.color_secondary,
        color_tertiary: settings.color_tertiary,
        nombre: settings.nombre,
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
