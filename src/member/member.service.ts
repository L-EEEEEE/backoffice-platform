import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { Tenant } from '../tenant/entities/tenant.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async create(createMemberDto: CreateMemberDto) {
    const { tenantId, ...memberData } = createMemberDto;

    const tenant = await this.tenantRepository.findOneBy({ id: tenantId });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    const newMember = this.memberRepository.create({
      ...memberData,
      tenant: tenant,
    });

    return await this.memberRepository.save(newMember);
  }

  async findByEmailWithTenant(email: string): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: { email },
      relations: ['tenant'],
    });

    if (!member) {
      throw new NotFoundException(`Member with email ${email} not found`);
    }
    return member;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    if (!userId) {
      throw new Error('UserId is required for update refresh token');
    }
    const saltOrRounds = 10;
    const hashedRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
    await this.memberRepository.update(userId, {
      currentRefreshToken: hashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.memberRepository.findOne({ where: { id: userId } });

    if (!user || !user.currentRefreshToken) return null;

    const isMatched = await bcrypt.compare(refreshToken, user.currentRefreshToken);
    if (isMatched) return user;

    return null;
  }

  async removeRefreshToken(userId: number) {
    return this.memberRepository.update(userId, {
      currentRefreshToken: null,
    });
  }
}
