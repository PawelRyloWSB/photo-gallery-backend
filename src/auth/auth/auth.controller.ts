import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { RefreshAuthGuard } from './refresh.guard';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Post('register')
  async register(
    @Body() { email, password }: CreateUserDto,
    @Res({ passthrough: true }) res,
  ): Promise<User> {
    const user = await this.authService.register({ email, password });
    await this.authService.setAuthToken(res, {
      user_id: user.id,
    });

    return user;
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req, @Res() res) {
    await this.authService.tokenIsActive(
      req?.cookies?.['refresh_token'],
      req.user.refreshToken,
    );

    await this.authService.setAuthToken(res, {
      user_id: req.user.id,
    });

    res.json({
      message: 'Token refreshed.',
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() { email, password }: LoginUserDto,
    @Res({ passthrough: true }) res,
  ) {
    const user = await this.authService.login({ email, password });
    await this.authService.setAuthToken(res, {
      user_id: user.id,
    });

    return user;
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req, @Res({ passthrough: true }) res) {
    await this.authService.clearAuthTokens(res, req.user.id);
    return {
      message: 'Logged out',
    };
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async delete(@Req() req, @Res({ passthrough: true }) res) {
    await this.authService.clearAuthTokens(res, req.user.id);
    return this.userService.delete(req.user.id);
  }
}
