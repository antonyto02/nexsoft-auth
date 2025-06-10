import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
  ) {}

  findAll() {
    return this.usersRepo.find({
      where: { is_deleted: false },
      relations: { role: true },
    });
  }

  async create(dto: CreateUserDto) {
    const role = await this.rolesRepo.findOne({ where: { id: dto.role_id } });
    if (!role) throw new NotFoundException('Role not found');
    const password = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      username: dto.username,
      password,
      first_name: dto.first_name,
      last_name: dto.last_name,
      role,
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
    await this.usersRepo.save(user);
  }

  async updatePassword(id: string, newPassword: string) {
    const user = await this.findOne(id);
    user.password = await bcrypt.hash(newPassword, 10);
    await this.usersRepo.save(user);
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
