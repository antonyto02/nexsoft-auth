import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'password_resets', schema: 'auth' })
export class PasswordReset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ unique: true })
  token: string;

  @Column({ type: 'timestamptz' })
  expires_at: Date;

  @Column({ default: false })
  used: boolean;

  @CreateDateColumn()
  created_at: Date;
}
