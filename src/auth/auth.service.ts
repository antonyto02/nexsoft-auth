import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { SystemSetting } from '../system-settings/entities/system-setting.entity';
import { Session } from '../sessions/entities/session.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(SystemSetting)
    private settingsRepo: Repository<SystemSetting>,
    @InjectRepository(Session) private sessionsRepo: Repository<Session>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersRepo.findOne({
      where: { username, is_deleted: false },
      relations: { role: true },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const match = await bcrypt.compare(pass, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');
    if (!user.is_active) throw new UnauthorizedException('User inactive');
    return user;
  }

  async login(dto: LoginDto, req: Request) {
    const user = await this.validateUser(dto.username, dto.password);
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role.name,
      company_id: user.company_id,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
    const settings = await this.settingsRepo.findOne({
      where: { nombre: 'default' },
    });
    await this.sessionsRepo.save(
      this.sessionsRepo.create({
        user,
        token: accessToken,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
        device: (req.headers['sec-ch-ua-platform'] as string) || undefined,
        expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000),
      }),
    );
    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role.name,
        language: user.language,
        theme: user.theme,
      },
      settings: settings && {
        logo_url: settings.logo_url,
        color_primary: settings.color_primary,
        color_secondary: settings.color_secondary,
        color_tertiary: settings.color_tertiary,
      },
    };
  }
}
