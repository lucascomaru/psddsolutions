"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const secret = 'chave_secreta';
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '1h' });
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        return null;
    }
}
function authenticate(req, res, next) {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
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
function checkPermissions(roles) {
    return (req, res, next) => {
        var _a;
        if (!roles.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.role)) {
            return res.status(403).json({ message: 'Acesso negado. Permissões insuficientes.' });
        }
        next();
    };
}
app.use(express_1.default.json());
app.post('/login', (req, res) => {
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
    }
    else {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }
});
app.get('/protected', authenticate, checkPermissions(['admin']), (req, res) => {
    const user = req.user;
    res.json({ message: 'Rota protegida acessada com sucesso', user });
});
app.get('/users', authenticate, checkPermissions(['admin']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const users = yield userRepository.find();
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
}));
app.get('/users/:id', authenticate, checkPermissions(['admin']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = yield userRepository.findOne(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
}));
app.post('/users', authenticate, checkPermissions(['admin']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = userRepository.create(req.body);
        const savedUser = yield userRepository.save(user);
        res.status(201).json(savedUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar usuário' });
    }
}));
app.put('/users/:id', authenticate, checkPermissions(['admin']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = yield userRepository.findOne(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        userRepository.merge(user, req.body);
        const updatedUser = yield userRepository.save(user);
        res.json(updatedUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
}));
app.delete('/users/:id', authenticate, checkPermissions(['admin']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = yield userRepository.findOne(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        yield userRepository.remove(user);
        res.json({ message: 'Usuário removido com sucesso' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao remover usuário' });
    }
}));
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
