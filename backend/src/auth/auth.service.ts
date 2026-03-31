import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      refreshToken: accessToken, // Simplified - in production, use separate refresh tokens
      user,
    };
  }

  async register(name: string, email: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const user = await this.usersService.create({ name, email, password });
    const { password: _, ...userWithoutPassword } = user;

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      refreshToken: accessToken,
      user: userWithoutPassword,
    };
  }
}
