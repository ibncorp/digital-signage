import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRole } from './user-role.entity';

@Entity({ name: 'roles' })
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 40 })
  rolename: string;

  @OneToMany(() => UserRole, (role) => role.role)
  userRoles?: UserRole[];
}
