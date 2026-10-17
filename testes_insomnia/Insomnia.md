# Evidências de Teste - CRUD de Utilizador e Autenticação JWT

Este documento contém as evidências de validação das rotas da API desenvolvidas para o módulo de utilizadores, testadas através do Insomnia.

---

## 1. Criar um Utilizador (POST /user)
**Objetivo:** Verificar a criação de um novo utilizador na base de dados, garantindo que o `senhaHash` **não** é retornado na resposta por motivos de segurança.
**Resultado:** Status `201 Created`. Utilizador inserido com sucesso na base PostgreSQL.

![Criar Utilizador](./prints/01-criar-utilizador.png)
![alt text](image.png)

---

## 2. Tentativa de Acesso sem Permissão (GET /user)
**Objetivo:** Validar o funcionamento do `AuthGuard` ao tentar aceder a uma rota protegida sem enviar o *Token JWT*.
**Resultado:** Status `401 Unauthorized`. A API bloqueou o acesso corretamente.

![Acesso Negado 401](./prints/02-acesso-negado.png)
![alt text](image-1.png)
---

## 3. Autenticação e Geração de Token (POST /auth/login)
**Objetivo:** Testar o *login* com credenciais válidas e verificar a emissão do *Token JWT*.
**Resultado:** Status `200/201 OK`. Token gerado com sucesso após o `bcrypt` validar a senha criptografada.

![Login e Token](./prints/03-login-token.png)
![alt text](image-2.png) Usando o token ![alt text](image-3.png)
---

## 4. Listar Utilizadores com Permissão (GET /user)
**Objetivo:** Aceder à rota protegida enviando o *Token JWT* através do cabeçalho de autorização (Bearer Token).
**Resultado:** Status `200 OK`. Lista de utilizadores devolvida (novamente, sem expor os hashes de senha).

![Listar Utilizadores 200](./prints/04-listar-utilizadores.png)
![alt text](image-4.png)
---

## 5. Buscar Utilizador Específico (GET /user/:id)
**Objetivo:** Validar a busca por ID numa rota protegida.
**Resultado:** Status `200 OK`. Dados do utilizador retornados corretamente.

![Buscar Utilizador por ID](./prints/05-buscar-por-id.png)
![alt text](image-5.png)