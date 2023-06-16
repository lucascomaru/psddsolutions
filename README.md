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
Banco de dados SQLite (ou outro banco de dados compatível com o TypeORM)
Configuração do Projeto
Siga as etapas abaixo para configurar e executar o projeto:

Clone o repositório para o seu ambiente local.
No diretório raiz do projeto, execute o comando npm install para instalar as dependências necessárias.
Configure o banco de dados editando o arquivo ormconfig.json. Certifique-se de fornecer as informações corretas para a conexão com o banco de dados desejado.
Execute o comando npm run start para iniciar a aplicação. O servidor será executado na porta 3000, a menos que seja especificada outra porta no arquivo server.js.
