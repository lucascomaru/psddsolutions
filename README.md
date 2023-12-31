# psddsolutions
Projeto do processo seletivo da DD Solutions

Este projeto é uma aplicação Node.js que demonstra a implementação de autenticação e controle de acesso em uma API usando o framework Express, o ORM TypeORM e tokens JWT (JSON Web Tokens).

Funcionalidades
O projeto possui as seguintes funcionalidades:

Autenticação de Usuário: A rota /login permite que um usuário faça login fornecendo um email e senha. Se as credenciais forem válidas, a API retorna um token JWT válido para o usuário.

Proteção de Rotas: A rota /protected é protegida e requer autenticação. Apenas usuários autenticados com um token JWT válido têm permissão para acessar essa rota.

Controle de Permissões: As rotas /users permitem gerenciar usuários (listar, criar, atualizar e excluir), porém, apenas usuários com a permissão de administrador têm acesso a essas rotas.

Pré-requisitos
Antes de executar o projeto, certifique-se de ter o seguinte instalado em seu ambiente de desenvolvimento:

Node.js
npm (gerenciador de pacotes do Node.js)
Banco de dados SQLite 

Rotas
GET /users
GET /users/:id
POST /users
PUT /users/:id
DELETE /users/:id

Este projeto foi testado utilizando o Postman, uma plataforma que permite realizar requisições HTTP e testar APIs de forma interativa.
Cabeçalho para requisição: Authorization: Bearer token_gerado

Considerações Finais
Este projeto demonstra a implementação de autenticação e controle de acesso em uma API usando o framework Express, o ORM TypeORM e tokens JWT. Foi possível observar as seguintes funcionalidades:

Autenticação de usuário utilizando email e senha.
Proteção de rotas, permitindo o acesso apenas a usuários autenticados com um token JWT válido.
Controle de permissões, permitindo que apenas usuários com a permissão de administrador acessem determinadas rotas.
Gerenciamento de usuários, incluindo listagem, criação, atualização e exclusão.
