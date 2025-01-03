import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { UpdateRoleDto } from '../dto/update-role.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    updateRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateRole', () => {
    it('should update user role successfully', async () => {
      const userId = '1';
      const updateRoleDto: UpdateRoleDto = { role: 'editor' };
      const expectedResult = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'editor',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockUsersService.updateRole.mockResolvedValue(expectedResult);

      const result = await controller.updateRole(userId, updateRoleDto);

      expect(service.updateRole).toHaveBeenCalledWith(1, 'editor');
      expect(result).toBe(expectedResult);
    });

    it('should handle errors when updating role', async () => {
      const userId = '1';
      const updateRoleDto: UpdateRoleDto = { role: 'editor' };
      const error = new Error('Update failed');

      mockUsersService.updateRole.mockRejectedValue(error);

      await expect(controller.updateRole(userId, updateRoleDto))
        .rejects.toThrow(error);
      expect(service.updateRole).toHaveBeenCalledWith(1, 'editor');
    });

    it('should convert string id to number when updating role', async () => {
      const userId = '123';
      const updateRoleDto: UpdateRoleDto = { role: 'admin' };
      
      await controller.updateRole(userId, updateRoleDto);

      expect(service.updateRole).toHaveBeenCalledWith(123, 'admin');
    });
  });
});