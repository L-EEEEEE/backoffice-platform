import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MemberService } from '../member/member.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly memberService: MemberService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 유저 유효성 검증
   */
  async validateUser(email: string): Promise<any> {
    try {
      return await this.memberService.findByEmailWithTenant(email);
    } catch (error) {
      return null;
    }
  }

  /**
   * 로그인: Access 및 Refresh Token 발급
   */
  async login(user: any) {
    this.validateUserId(user);

    const payload = this.createPayload(user);
    const { secret, expiresIn } = this.getRefreshConfig();

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret,
      expiresIn: expiresIn as any,
    });

    // 해싱된 리프레시 토큰 저장
    await this.memberService.setCurrentRefreshToken(refreshToken, user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  /**
   * Access Token 단독 재발급
   */
  async generateAccessToken(user: any) {
    this.validateUserId(user);
    return this.jwtService.sign(this.createPayload(user));
  }

  /**
   * 로그아웃: Refresh Token 무효화
   */
  async logout(userId: number) {
    await this.memberService.removeRefreshToken(userId);
  }

  // --- Private Helpers ---

  private createPayload(user: any) {
    return { email: user.email, sub: user.id };
  }

  private validateUserId(user: any) {
    if (!user?.id) {
      throw new InternalServerErrorException(
        '유저 식별 정보가 없어 요청을 처리할 수 없습니다.',
      );
    }
  }

  private getRefreshConfig() {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRE_TIME');

    if (!secret || !expiresIn) {
      throw new InternalServerErrorException(
        'JWT 설정(Secret/Expiration)이 누락되었습니다. .env 파일을 확인하세요.',
      );
    }
    return { secret, expiresIn };
  }
}