import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private rolesRepo: Repository<Role>) {}

  findAll() {
    return this.rolesRepo.find();
  }

  findOne(id: string) {
    return this.rolesRepo.findOne({ where: { id } });
  }
}
