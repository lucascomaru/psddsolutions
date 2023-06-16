import { getRepository } from 'typeorm';
import { User } from '../entity/User';

class UserService {
  private userRepository = getRepository(User);

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.find();
      return users;
    } catch (error) {
      throw new Error('Erro ao buscar os usuários');
    }
  }

  async getUserById(id: number): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne(id);
      return user;
    } catch (error) {
      throw new Error('Erro ao buscar o usuário');
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const user = this.userRepository.create(userData);
      const savedUser = await this.userRepository.save(user);
      return savedUser;
    } catch (error) {
      throw new Error('Erro ao criar o usuário');
    }
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne(id);

      if (!user) {
        return undefined;
      }

      this.userRepository.merge(user, userData);
      const updatedUser = await this.userRepository.save(user);
      return updatedUser;
    } catch (error) {
      throw new Error('Erro ao atualizar o usuário');
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const user = await this.userRepository.findOne(id);

      if (user) {
        await this.userRepository.remove(user);
      }
    } catch (error) {
      throw new Error('Erro ao remover o usuário');
    }
  }
}

export default UserService;
