import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RolesService } from '../roles/roles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@UseGuards(JwtAuthGuard)
@Controller('auth/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      message: 'Lista de usuarios obtenida correctamente',
      users,
    };
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: CreateUserDto) {
    await this.usersService.create(dto);
    return { message: 'Usuario creado correctamente' };
  }

  @Get(':id/details')
  async findDetails(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    const roles = await this.rolesService.findAll();
    return {
      message: 'Datos del usuario obtenidos correctamente',
      user,
      roles,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    await this.usersService.update(id, dto);
    return { message: 'Usuario actualizado correctamente' };
  }

  @Patch(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    await this.usersService.updatePassword(id, dto.new_password);
    return { message: 'Contraseña actualizada correctamente' };
  }

  @Patch(':id/status')
  async toggleStatus(@Param('id') id: string) {
    const user = await this.usersService.toggleStatus(id);
    const action = user.is_active ? 'activado' : 'desactivado';
    return {
      message: `Usuario ${action} correctamente`,
      user,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { message: 'Usuario eliminado correctamente' };
  }

  @Get(':id/preferences')
  async getPreferences(@Param('id') id: string) {
    const prefs = await this.usersService.getPreferences(id);
    return prefs;
  }

  @Patch(':id/preferences')
  async updatePreferences(
    @Param('id') id: string,
    @Body() dto: UpdatePreferencesDto,
  ) {
    const prefs = await this.usersService.updatePreferences(
      id,
      dto.language,
      dto.theme,
    );
    return prefs;
  }
}
