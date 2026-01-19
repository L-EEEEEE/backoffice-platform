import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user: any) {
    // 1. DTO 데이터와 인증 유저 정보를 결합하여 엔터티 생성
    const post = this.postRepository.create({
      ...createPostDto,
      // relations 설정을 위해 ID 객체 형태로 전달
      author: { id: user.userId },
      tenant: { id: user.tenantId },
    });

    // 2. DB 저장
    return await this.postRepository.save(post);
  }

  async findAllByTenant(tenantId: number) {
    return await this.postRepository.find({
      where: { tenant: { id: tenantId } }, // 내 조직 ID로 필터링
      relations: ['author'], // 작성자 정보도 함께 가져오기
      order: { createdAt: 'DESC' }, // 최신글 순으로 정렬
    });
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
