import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddPhotoDto {
  @IsNumber()
  id: number;
  @IsNotEmpty()
  filename: string;

  @IsNotEmpty()
  data: Buffer;
}
