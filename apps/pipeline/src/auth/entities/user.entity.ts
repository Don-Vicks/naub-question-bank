import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export type UserRole = 'admin' | 'user';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', default: 'user' })
  role: UserRole;

  @Column({ nullable: true })
  facultyId?: string;

  @Column({ nullable: true })
  departmentId?: string;

  @Column({ nullable: true })
  level?: string;

  @CreateDateColumn()
  createdAt: Date;
}
