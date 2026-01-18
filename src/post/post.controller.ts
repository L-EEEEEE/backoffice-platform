import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Post')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // 게시판은 로그인 필수
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: '게시글 작성', description: '로그인된 유저의 소속 조직(Tenant)으로 글을 저장합니다.' })
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    // JwtStrategy에서 validate()가 반환한 정보가 req.user에 들어있습니다.
    return this.postService.create(createPostDto, req.user);
  }
}