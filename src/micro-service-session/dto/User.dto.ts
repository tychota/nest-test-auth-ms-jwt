import { IsNumber, IsString, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';

// tslint:disable-next-line: max-classes-per-file
export class UserInputDto {
  @IsString()
  public email: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsString()
  @MinLength(8)
  public clearPassword: string;
}

// tslint:disable-next-line: max-classes-per-file
export class UserOutputDto {
  @IsNumber()
  public userId: number;

  @IsString()
  public email: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @Exclude()
  public hashedPassword: string;
}
