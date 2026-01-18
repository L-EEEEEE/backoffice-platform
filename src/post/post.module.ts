import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 추가
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity'; // 추가

@Module({
  imports: [TypeOrmModule.forFeature([Post])], // 엔티티 등록
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}