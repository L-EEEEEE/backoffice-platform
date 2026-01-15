import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { MemberService } from '../../member/member.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService,
    private memberService: MemberService,
  ) {
    const secret = configService.get<string>('JWT_REFRESH_SECRET');
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret, // undefined가 아님을 보장
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    // 1. 헤더가 없는 경우에 대한 방어 로직 추가 (TS2532 해결)
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header가 없습니다.');
    }

    const refreshToken = authHeader.replace('Bearer', '').trim();
    const userId = payload.sub;

    const user = await this.memberService.getUserIfRefreshTokenMatches(
      refreshToken,
      userId,
    );

    if (!user) {
      throw new UnauthorizedException('유효하지 않거나 만료된 Refresh Token입니다.');
    }

    return user;
  }
}