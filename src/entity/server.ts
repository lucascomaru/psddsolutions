import express, { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from './User';

const app = express();
const port = process.env.PORT || 3000;

const secret = 'chave_secreta';

function generateToken(payload: object): string {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    return null;
  }
}

interface CustomRequest extends Request {
  user?: JwtPayload;
}

function authenticate(req: CustomRequest, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  req.user = decoded;

  next();
}

function checkPermissions(roles: string[]) {
  return (req: CustomRequest, res: Response, next: NextFunction) => {

    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: 'Acesso negado. Permissões insuficientes.' });
    }

    next();
  };
}

app.use(express.json());

app.post('/login', (req: Request, res: Response) => {
  const { email, senha } = req.body;

  if (email === 'usuario@example.com' && senha === 'senha123') {
    const user = {
      id: 1,
      name: 'Usuário',
      email: 'usuario@example.com',
      role: 'user', 
    };

    const token = generateToken(user);

    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }
});


app.get('/protected', authenticate, checkPermissions(['admin']), (req: CustomRequest, res: Response) => {

    const user = req.user as JwtPayload;
  
    res.json({ message: 'Rota protegida acessada com sucesso', user });
  });
  

  app.get('/users', authenticate, checkPermissions(['admin']), async (req: CustomRequest, res: Response) => {
    try {
      const userRepository = getRepository(User);
      const users = await userRepository.find();
  
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
  });
  
  app.get('/users/:id', authenticate, checkPermissions(['admin']), async (req: CustomRequest, res: Response) => {
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
  
  app.post('/users', authenticate, checkPermissions(['admin']), async (req: CustomRequest, res: Response) => {
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
  
  app.put('/users/:id', authenticate, checkPermissions(['admin']), async (req: CustomRequest, res: Response) => {
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
  
  app.delete('/users/:id', authenticate, checkPermissions(['admin']), async (req: CustomRequest, res: Response) => {
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
  
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
  