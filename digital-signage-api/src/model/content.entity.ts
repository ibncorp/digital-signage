import { Entity, Column, OneToMany, ManyToOne, OneToOne, JoinTable } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Device } from './device.entity';
import { Media } from './media.entity';

@Entity({ name: 'content' })
export class Content extends BaseEntity {

  @Column({ type: 'int'})
  type: number;

  @ManyToOne(() => Media, (media) => media.contents)
  media?: Media;
  
  @ManyToOne(() => Device, (device) => device.contents)
  device?: Device;
}
