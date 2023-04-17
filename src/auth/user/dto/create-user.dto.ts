import { UpdateUserDto } from './update-user.dto';
import { IsString } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';
import { Match } from '../../../common/decorators/match.decorator';

export class CreateUserDto extends OmitType(UpdateUserDto, ['id'] as const) {
  @IsString()
  @Match<CreateUserDto>('password')
  confirmPassword: string;
}
