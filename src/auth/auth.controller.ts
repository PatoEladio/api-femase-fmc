import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>, @Req() req: Request) {
    return this.authService.signIn(signInDto.username, signInDto.password, req)
  }
}
