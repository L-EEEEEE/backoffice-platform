import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MemberService } from '../member/member.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private memberService: MemberService,
  ) {}

  async validateUser(email: string): Promise<any> {
    try {
      const user = await this.memberService.findByEmailWithTenant(email);
      return user;
    } catch (error) {
      return null;
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
