import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    if (!email) {
      return null;
    }

    try {
      const user = await this.usersRepository.findOne({ 
        where: { email },
        // Optionally include other relations or select specific fields
        // select: ['id', 'email', 'name', 'password', 'role']
      });

      return user || null;
    } catch (error) {
      // Log the error for debugging
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  // Find user by ID
  async findById(id: number): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOne({ 
        where: { id },
        select: ['id', 'email', 'name', 'role', 'created_at', 'updated_at']
      });

      return user || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  async updateRole(id: number, role: 'admin' | 'editor' | 'viewer'): Promise<User> {
    await this.usersRepository.update(id, { role });
    return this.usersRepository.findOne({ where: { id } });
  }
  
}