# Bay Peoples

## Get Started

### Requirements

- Docker
- NodeJS

### Locally

Install dependencies

```
yarn
```

Create `.env` at the root directory with content copied from .env.template and ensure correct values are provided.

Source the `DATABASE_URL` to terminal for Prisma to make database migrations:

```
export DATABASE_URL="postgresql://postgres:password@127.0.0.1:5400/postgres"
```

Ensure that PostgreSQL instance is running

```
docker run -d -p 5400:5432 -e POSTGRES_PASSWORD=password postgres:12-alpine
```

Sync the database with all migrations

```
npx prisma migrate up --experimental
```

Generate prisma files

```
npx prisma generate
```

Finally, run the server

```
yarn start:dev
```
