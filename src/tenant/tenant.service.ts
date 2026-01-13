import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const newTenant = this.tenantRepository.create(createTenantDto);
    return await this.tenantRepository.save(newTenant);
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantRepository.find();
  }
}