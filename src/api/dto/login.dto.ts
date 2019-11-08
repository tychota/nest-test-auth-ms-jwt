import { IsEmail, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'tychot@bam.tech' })
  @IsEmail()
  public email: string;

  @ApiProperty({ example: 'password2018!!' })
  @IsString()
  @MinLength(8)
  public clearPassword: string;
}
