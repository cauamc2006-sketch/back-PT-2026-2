# STOCK.IO - Integracao conjunta do backend

Branch de trabalho criada a partir de `dev`, reunindo:
- `feat/crud-lojas` (lojas)
- `feat/crud-comentario` (comentarios)
- `feat/integracao-produtos-lucas` (CRUD de produtos; preferida a `feat/CRUD-produtos`, que estava incompleta)
- `feat/integracao-login` (migracao/dependencias)
- `dev` (usuarios/autenticacao existentes)

Todos os modulos adicionais sao registrados em `src/app.module.ts`.

IMPORTANTE: uniao das branches nao garante integracao funcional. E preciso validar os endpoints e o frontend, especialmente autenticacao/autorizacao, relacionamentos Prisma, categorias e banco de dados real.

Configuracao real: crie `.env` local com `DATABASE_URL`, **nunca publique o arquivo**. `npx prisma generate` nao realiza migracoes; migracoes precisam ser revisadas antes de serem aplicadas no banco.

Nao mesclar em `dev` sem revisao. Nao subir senhas.