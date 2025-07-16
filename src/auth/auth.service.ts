import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { Session } from '../sessions/entities/session.entity';
import { PasswordReset } from '../password-resets/entities/password-reset.entity';
import { EmailService } from '../shared/email.service';
import { LoginDto } from './dto/login.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Session) private sessionsRepo: Repository<Session>,
    @InjectRepository(PasswordReset)
    private passwordResetsRepo: Repository<PasswordReset>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersRepo.findOne({
      where: { username, is_deleted: false },
      relations: { role: true, company: true },
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
      companyId: user.company.id,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
    const settings = user.company;
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
        first_name: user.first_name,
        role: user.role.name,
        language: user.language,
        theme: user.theme,
      },
      settings: settings && {
        company_name: settings.nombre,
        logo_url: settings.logo_url,
        color_primary: settings.color_primary,
        color_secondary: settings.color_secondary,
        color_tertiary: settings.color_tertiary,
      },
    };
  }

  async requestPasswordReset(email: string) {
    const user = await this.usersRepo.findOne({ where: { username: email } });
    if (!user) return;
    try {
      const token = randomUUID();
      const expires_at = new Date(Date.now() + 15 * 60 * 1000);
      await this.passwordResetsRepo.save(
        this.passwordResetsRepo.create({ user, token, expires_at }),
      );
      await this.emailService.sendPasswordResetEmail(email, token);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async resetPassword(token: string, newPassword: string) {
    const reset = await this.passwordResetsRepo.findOne({
      where: { token },
      relations: { user: true },
    });
    if (!reset || reset.used || reset.expires_at < new Date()) {
      throw new BadRequestException('Invalid token');
    }
    reset.used = true;
    reset.user.password = await bcrypt.hash(newPassword, 10);
    await this.usersRepo.save(reset.user);
    await this.passwordResetsRepo.save(reset);
  }
}
