import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRole } from './user-role.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 40 })
  username: string;

  @Column({ type: 'varchar', length: 50 })
  firstname: string;

  @Column({ type: 'varchar', length: 100 })
  lastname: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 300 })
  password: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles?: UserRole[];
}
