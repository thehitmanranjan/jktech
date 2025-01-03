import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return null when email is not provided', async () => {
      const result = await service.findByEmail('');
      expect(result).toBeNull();
      expect(repository.findOne).not.toHaveBeenCalled();
    });

    it('should return user when found by email', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'viewer',
      };

      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(repository.findOne).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
      };

      const mockCreatedUser = {
        id: 1,
        ...createUserDto,
        role: 'viewer',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRepository.create.mockReturnValue(mockCreatedUser);
      mockRepository.save.mockResolvedValue(mockCreatedUser);

      const result = await service.create(createUserDto);

      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(mockCreatedUser);
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('findById', () => {
    it('should return user when found by id', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'viewer',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: ['id', 'email', 'name', 'role', 'created_at', 'updated_at'],
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(999);

      expect(repository.findOne).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('updateRole', () => {
    it('should update user role successfully', async () => {
      const userId = 1;
      const newRole = 'editor' as const;
      const mockUpdatedUser = {
        id: userId,
        role: newRole,
        name: 'Test User',
        email: 'test@example.com',
      };

      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue(mockUpdatedUser);

      const result = await service.updateRole(userId, newRole);

      expect(repository.update).toHaveBeenCalledWith(userId, { role: newRole });
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should handle errors when updating role', async () => {
      const userId = 1;
      const newRole = 'admin' as const;

      mockRepository.update.mockRejectedValue(new Error('Update failed'));

      await expect(service.updateRole(userId, newRole))
        .rejects.toThrow('Update failed');
    });
  });
});