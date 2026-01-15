import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Tenant } from '../../tenant/entities/tenant.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true, type: 'varchar' })
  currentRefreshToken: string | null;

  @ManyToOne(() => Tenant, (tenant) => tenant.members)
  tenant: Tenant;
}