import { IsString, MinLength } from 'class-validator';

export class UserOutputDto {
  @IsString()
  public email: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;
}
