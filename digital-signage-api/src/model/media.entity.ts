import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Content } from './content.entity';

@Entity({ name: 'media' })
export class Media extends BaseEntity {

  @Column({ type: 'varchar', length: 64 })
  fileName: string;

  @Column({ type: 'varchar', length: 64 })
  displayName: string;

  @Column({ type: 'varchar', length: 32 })
  mimeType: string;
  
  @Column({ type: 'varchar', length: 100 })
  path: string;
  
  @Column({ type: 'varchar', length: 100 , nullable: true})
  description: string;

  @OneToMany(() => Content, (content) => content.media)
  contents?: Content[];

  @Column({ type: 'int'})
  type: number;
}
