import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { SystemSetting } from '../system-settings/entities/system-setting.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
    @InjectRepository(SystemSetting)
    private settingsRepo: Repository<SystemSetting>,
  ) {}

  findAll(companyId: string) {
    return this.usersRepo.find({
      where: { is_deleted: false, company: { id: companyId } },
      relations: { role: true },
    });
  }

  async create(dto: CreateUserDto, companyId: string) {
    const role = await this.rolesRepo.findOne({ where: { id: dto.role_id } });
    if (!role) throw new NotFoundException('Role not found');
    const company = await this.settingsRepo.findOne({
      where: { id: companyId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const password = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      username: dto.username,
      password,
      first_name: dto.first_name,
      last_name: dto.last_name,
      role,
      company,
      theme: 'light',
      language: 'es',
    });
    return this.usersRepo.save(user);
  }

  async findOne(id: string) {
    const user = await this.usersRepo.findOne({
      where: { id, is_deleted: false },
      relations: { role: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    const role = await this.rolesRepo.findOne({ where: { id: dto.role_id } });
    if (!role) throw new NotFoundException('Role not found');
    user.username = dto.username;
    user.first_name = dto.first_name;
    user.last_name = dto.last_name;
    user.role = role;
    user.is_active = dto.is_active;
    await this.usersRepo.save(user);
  }

  async updatePassword(id: string, newPassword: string) {
    const user = await this.findOne(id);
    user.password = await bcrypt.hash(newPassword, 10);
    await this.usersRepo.save(user);
  }

  findByUsername(username: string) {
    return this.usersRepo.findOne({
      where: { username, is_deleted: false },
      relations: { role: true },
    });
  }

  async getPreferences(id: string) {
    const user = await this.findOne(id);
    return { language: user.language, theme: user.theme };
  }

  async updatePreferences(id: string, language?: string, theme?: string) {
    const user = await this.findOne(id);
    if (language !== undefined) user.language = language;
    if (theme !== undefined) user.theme = theme;
    await this.usersRepo.save(user);
    return { language: user.language, theme: user.theme };
  }

  async toggleStatus(id: string) {
    const user = await this.findOne(id);
    user.is_active = !user.is_active;
    await this.usersRepo.save(user);
    return { id: user.id, is_active: user.is_active };
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    user.is_deleted = true;
    user.is_active = false;
    await this.usersRepo.save(user);
  }
}
