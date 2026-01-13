import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  tenantId: number;
}
