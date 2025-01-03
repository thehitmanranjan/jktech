import { 
    Controller, 
    Post, 
    Body, 
    UseGuards, 
    Request, 
    HttpCode, 
    HttpStatus 
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { LocalAuthGuard } from './guards/local-auth.guard';
  import { RegisterDto } from './dto/register.dto';
  import { LoginDto } from './dto/login.dto';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
      return this.authService.register(registerDto);
    }
  
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
      const user = await this.authService.validateUser(
        loginDto.email, 
        loginDto.password
      );
      return this.authService.login(user);
    }
  
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Request() req) {
      // In JWT, logout is typically handled client-side by removing the token
      return { message: 'Logout successful' };
    }
  }