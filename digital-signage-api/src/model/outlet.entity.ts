import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Device } from './device.entity';

@Entity({ name: 'outlet' })
export class Outlet extends BaseEntity {
  @Column({ type: 'varchar', length: 40 })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  region: string;

  @OneToMany(() => Device, (device) => device.outlet)
  devices?: Device[];
}
