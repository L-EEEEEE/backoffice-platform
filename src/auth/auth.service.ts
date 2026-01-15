import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MemberService } from '../member/member.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private memberService: MemberService,
    private configService: ConfigService,
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
    if (!user || !user.id) {
      throw new InternalServerErrorException('유저 식별 정보가 없어 로그인을 진행할 수 없습니다.');
    }
    const payload = { email: user.email, sub: user.id };

    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const refreshExpiresIn= this.configService.get<string>('JWT_REFRESH_EXPIRE_TIME');

    if (!refreshSecret || !refreshExpiresIn) {
      throw new InternalServerErrorException('JWT 설정(Secret 또는 Expiration이 누락되었습니다. .env 파일을 확인하세요.');
    }

    // AccessToken 생성
    const accessToken = this.jwtService.sign(payload);

    // RefreshToken 생성
    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn as any,
    });
    await this.memberService.setCurrentRefreshToken(refreshToken, user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async logout(userId: number) {
    await this.memberService.removeRefreshToken(userId);
  }
}
