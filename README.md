# Projeto CRUD – Cadastro de Alunos

Aplicação web de cadastro de alunos desenvolvida como projeto da faculdade. Permite **criar, listar, visualizar, editar e excluir** cadastros, com **foto de perfil opcional** armazenada diretamente no banco de dados PostgreSQL.

## Funcionalidades

- **Create:** formulário de cadastro com nome, idade, email e foto (opcional).
- **Read:** listagem de todos os cadastros e página de perfil com a foto e os dados de cada aluno.
- **Update:** edição dos dados, podendo manter a foto atual ou enviar uma nova.
- **Delete:** exclusão de um cadastro, com confirmação.
- Perfil sem foto exibe uma imagem padrão.
- Página 404 personalizada.
- Validação dos campos no formulário (`required`, limites de idade e tamanho).
- Limite de 2 MB para o upload da foto.

## Tecnologias

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [express-handlebars](https://github.com/express-handlebars/express-handlebars) (templates)
- [PostgreSQL](https://www.postgresql.org/) com o driver [`pg`](https://node-postgres.com/)
- [Multer](https://github.com/expressjs/multer) (upload de arquivos em memória)
- HTML e CSS

## Estrutura do projeto

```
Projeto CRUD faculdade/
├── config/
│   └── db.js              # conexão com o PostgreSQL (Pool)
├── public/
│   ├── css/
│   │   └── style.css      # estilos da aplicação
│   └── img/               # imagem padrão para perfis sem foto
├── routes/
│   └── routes.js          # rotas da aplicação
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   └── partials/
├── server.js              # ponto de entrada
└── package.json
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [PostgreSQL](https://www.postgresql.org/) instalado e em execução

## Como executar

1. **Clone o repositório e entre na pasta:**

   ```bash
   git clone <url-do-repositorio>
   cd <nome-da-pasta>
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Crie o banco de dados** no PostgreSQL e, em seguida, a tabela abaixo.

4. **Configure a conexão** no arquivo `config/db.js` com o seu usuário, senha e nome do banco.

5. **Inicie a aplicação:**

   ```bash
   npm start
   ```

6. Acesse `http://localhost:3000` no navegador.

## Banco de dados

```sql
CREATE TABLE cadastros (
    idcadastros SERIAL PRIMARY KEY NOT NULL,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    age         INTEGER NOT NULL,
    bytes       BYTEA,
    photo_type  VARCHAR(255)
);
```

As colunas `bytes` e `photo_type` guardam, respectivamente, o conteúdo da foto e o tipo do arquivo (por exemplo, `image/jpeg`). Ficam vazias para cadastros sem foto.

## Rotas

| Método | Rota                                  | Descrição                             |
| ------ | ------------------------------------- | ------------------------------------- |
| GET    | `/`                                   | Formulário de cadastro                |
| POST   | `/acesso/user/save`                   | Salva um novo cadastro                |
| GET    | `/acesso/cadastros`                   | Lista todos os cadastros              |
| GET    | `/acesso/cadastro/:id`                | Página de perfil do cadastro          |
| GET    | `/acesso/images/:id`                  | Devolve a foto salva no banco         |
| GET    | `/acesso/cadastro/:id/update`         | Formulário de edição preenchido       |
| POST   | `/acesso/cadastro/:id/update/save`    | Salva as alterações                   |
| POST   | `/acesso/cadastro/:id/delete`         | Exclui o cadastro                     |

## Autor

Desenvolvido por **[seu nome]** para a disciplina de **[nome da disciplina]**, **[sua instituição]**.

## Licença

Este projeto está sob a licença descrita no arquivo [LICENSE](LICENSE).
