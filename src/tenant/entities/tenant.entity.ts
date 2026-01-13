import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; /* 조직명 */

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}