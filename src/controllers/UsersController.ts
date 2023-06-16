import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

const router = Router();


router.get('/', async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);
    const users = await userRepository.find();

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
});


router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
});


router.post('/', async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);
    const user = userRepository.create(req.body);
    const savedUser = await userRepository.save(user);

    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
});


router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    userRepository.merge(user, req.body);
    const updatedUser = await userRepository.save(user);

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
});


router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await userRepository.remove(user);

    res.json({ message: 'Usuário removido com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover usuário' });
  }
});

export default router;
