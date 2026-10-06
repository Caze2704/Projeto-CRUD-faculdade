# Projeto CRUD – Cadastro de Alunos

Aplicação web de cadastro de alunos desenvolvida como projeto da faculdade. Permite **criar, listar, buscar, visualizar, editar e excluir** cadastros, com **foto de perfil opcional** armazenada diretamente no banco de dados PostgreSQL e **busca em tempo real** feita com a Fetch API.

## Funcionalidades

- **Create:** formulário de cadastro com nome, idade, email e foto (opcional).
- **Read:** listagem de todos os cadastros e página de perfil com a foto e os dados de cada aluno.
- **Busca em tempo real:** o campo de busca consulta um endpoint JSON próprio com a **Fetch API** (`async/await`) e atualiza a lista sem recarregar a página, com *debounce* de 300 ms.
- **Update:** edição dos dados, podendo manter a foto atual ou enviar uma nova, com opção de cancelar.
- **Delete:** exclusão de um cadastro, com confirmação.
- Mensagens de feedback após criar, atualizar e excluir, e aviso quando o email já está cadastrado.
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
- [dotenv](https://github.com/motdotla/dotenv) (variáveis de ambiente)
- JavaScript no navegador com a [Fetch API](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)
- HTML e CSS

## Estrutura do projeto

```
Projeto-CRUD-faculdade/
├── config/
│   └── db.js              # conexão com o PostgreSQL (Pool), usa as variáveis do .env
├── public/
│   ├── css/
│   │   └── style.css      # estilos da aplicação
│   ├── img/               # imagem padrão para perfis sem foto
│   └── js/
│       └── busca.js       # busca em tempo real (Fetch API)
├── routes/
│   └── routes.js          # rotas da aplicação
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── partials/
│   └── *.handlebars       # home, cadastros, cadastro, editar e 404
├── .env.example           # modelo das variáveis de ambiente
├── server.js              # ponto de entrada
└── package.json
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [PostgreSQL](https://www.postgresql.org/) instalado e em execução

## Como executar

1. **Clone o repositório e entre na pasta:**

   ```bash
   git clone https://github.com/Caze2704/Projeto-CRUD-faculdade.git
   cd Projeto-CRUD-faculdade
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Crie o banco de dados** no PostgreSQL e, nele, a tabela da seção [Banco de dados](#banco-de-dados).

4. **Crie o arquivo `.env`** a partir do modelo e preencha com os seus dados (veja [Variáveis de ambiente](#variáveis-de-ambiente)):

   ```bash
   # Windows (PowerShell ou CMD)
   copy .env.example .env

   # macOS / Linux
   cp .env.example .env
   ```

5. **Inicie a aplicação:**

   ```bash
   npm start
   ```

6. Acesse `http://localhost:3000` no navegador.

## Variáveis de ambiente

A conexão com o banco é lida do arquivo `.env`, que **não** é enviado ao repositório.

| Variável      | Descrição                          |
| ------------- | ---------------------------------- |
| `DB_HOST`     | Endereço do servidor (ex.: `localhost`) |
| `DB_USER`     | Usuário do PostgreSQL              |
| `DB_PASSWORD` | Senha do usuário                   |
| `DB_NAME`     | Nome do banco criado no passo 3    |

> Se a senha tiver `#` ou espaços, coloque-a entre aspas duplas no `.env`. Sem as aspas, o `#` é tratado como início de comentário e a senha chega cortada.

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

| Método | Rota                                | Descrição                                         |
| ------ | ----------------------------------- | ------------------------------------------------- |
| GET    | `/`                                 | Formulário de cadastro                            |
| POST   | `/acesso/user/save`                 | Salva um novo cadastro                            |
| GET    | `/acesso/cadastros`                 | Lista todos os cadastros                          |
| GET    | `/acesso/api/cadastros`             | Retorna em JSON os cadastros filtrados pelo nome  |
| GET    | `/acesso/cadastro/:id`              | Página de perfil do cadastro                      |
| GET    | `/acesso/images/:id`                | Devolve a foto salva no banco                     |
| POST   | `/acesso/cadastro/:id/update`       | Formulário de edição preenchido                   |
| POST   | `/acesso/cadastro/:id/update/save`  | Salva as alterações                               |
| POST   | `/acesso/cadastro/:id/delete`       | Exclui o cadastro                                 |

## Como a busca funciona

1. O arquivo `public/js/busca.js` escuta o campo de busca e espera 300 ms depois da última tecla (*debounce*).
2. Ele chama a rota `GET /acesso/api/cadastros?busca=` com `fetch`, verifica a resposta e converte o corpo para JSON.
3. A lista é refeita no navegador com `createElement` e `textContent`, sem recarregar a página. Se nada for encontrado ou houver erro, aparece um aviso no lugar da lista.

## Autor

Desenvolvido por **Eduardo Henrique** para a disciplina de **Lógica de programação**, **UFRN**.

## Licença

Este projeto está sob a licença descrita no arquivo [LICENSE](LICENSE).