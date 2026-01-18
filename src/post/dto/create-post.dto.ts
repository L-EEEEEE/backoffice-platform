import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: '게시글 제목입니다.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  title: string;

  @ApiProperty({ example: '게시글 본문 내용입니다.' })
  @IsString()
  @IsNotEmpty()
  content: string;
}