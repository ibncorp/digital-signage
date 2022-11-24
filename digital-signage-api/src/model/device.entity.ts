import { Outlet } from './outlet.entity';
import { BaseEntity } from './base.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Content } from './content.entity';

@Entity({ name: 'device' })
export class Device extends BaseEntity {
  @Column({ type: 'varchar', length: 40 })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ManyToOne(() => Outlet, (outlet) => outlet.devices)
  outlet?: Outlet;

  @Column({ type: 'int'})
  type: number;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @OneToMany(() => Content, (content) => content.device)
  contents?: Content[];
}
