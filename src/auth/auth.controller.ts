import { Controller, Post, Body, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '로그인 및 JWT 발급', description: '이메일을 입력받아 실제 DB에 존재하는 유저인지 확인 후 토큰 반환' })
  @ApiBody({ schema: {example: { email: 'test.example.com' } } })
  @ApiResponse({ status: 201, description: '로그인 성공'})
  @ApiResponse({ status: 401, description: '인증 실패'})
  async login(@Body() body: { email: string }) {
    const user = await this.authService.validateUser(body.email);

    if (!user) {
      throw new UnauthorizedException('이메일 또는 사용자를 찾을 수 없습니다.');
    }

    return this.authService.login(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}