import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.entity';
import { User } from './user.entity';

@Entity({ name: 'userroles' })
export class UserRole extends BaseEntity {
  @ManyToOne(() => User, (user) => user.userRoles)
  user?: User;
  @ManyToOne(() => Role, (role) => role.userRoles)
  role?: Role;
}
