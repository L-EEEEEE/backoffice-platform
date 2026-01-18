import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Member } from '../../member/entities/member.entity';
import { Tenant } from '../../tenant/entities/tenant.entity';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  // 작성자 정보 (Member와 N:1 관계)
  @ManyToOne(() => Member, (member) => member.id)
  @JoinColumn({ name: 'author_id' })
  author: Member;

  // 소속 조직 (Tenant와 N:1 관계 - 데이터 격리의 핵심)
  @ManyToOne(() => Tenant, (tenant) => tenant.id)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}