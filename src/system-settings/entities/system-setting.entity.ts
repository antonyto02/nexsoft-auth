import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'system_settings', schema: 'auth' })
export class SystemSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ nullable: true })
  color_primary: string;

  @Column({ nullable: true })
  color_secondary: string;

  @Column({ nullable: true })
  color_tertiary: string;
}
