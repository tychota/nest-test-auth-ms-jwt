import { IsEmail, MinLength, IsString } from 'class-validator';

export class EmailPasswordCredentialsInputDto {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(8)
  public clearPassword: string;
}
