# JCS Imóveis

Projeto de imobiliária: listagem de imóveis, cadastro, exclusão e consultas (enquiries).

**Stack:** Next.js 16, shadcn/ui, Tailwind CSS 4, PostgreSQL, Prisma.

## Funcionalidades

- Ver imóveis na página inicial
- Adicionar imóveis à lista
- Excluir imóveis
- Enviar consultas sobre um imóvel
- Ver todas as consultas na página "Consultas"
- Ver consultas por imóvel na página de detalhe do imóvel

## Como rodar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um arquivo `.env` na raiz com a URL do PostgreSQL:

   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
   ```

   (Use `.env.example` como referência.)

3. Crie as tabelas no banco:

   ```bash
   npx prisma db push
   ```

4. Inicie o servidor:

   ```bash
   npm run dev
   ```

5. Acesse [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção (inclui `prisma generate`)
- `npm run db:push` — sincroniza o schema Prisma com o banco
- `npm run db:studio` — abre o Prisma Studio para o banco
