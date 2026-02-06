# Punto de Encuentro - Grupos de Hogar

Aplicación web para gestión de grupos de hogar de la comunidad Punto de Encuentro.

## Arquitectura

```
├── frontend/          # React + TypeScript + Vite
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── stores/
│
└── backend/           # Node.js + Express + TypeScript
    └── src/
        ├── config/        # Configuraciones
        ├── controllers/   # Maneja HTTP requests
        ├── database/      # Adaptadores de BD (abstracción)
        ├── middleware/    # Auth, error handling
        ├── models/        # Estructuras de datos
        ├── repositories/  # Acceso a datos
        ├── routes/        # Definición de rutas
        └── services/      # Lógica de negocio
```

## Stack Tecnológico

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS
- React Router DOM
- Zustand (estado global)

### Backend
- Node.js + Express + TypeScript
- JWT para autenticación
- bcryptjs para hash de contraseñas
- SQLite/JSON (fácil de cambiar para PostgreSQL, MySQL, etc.)

## Instalación

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

El servidor inicia en `http://localhost:3001`

### 2. Frontend

```bash
# En la raíz del proyecto
npm install
cp .env.example .env
npm run dev
```

El frontend inicia en `http://localhost:5173`

## Endpoints da API

### Auth
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrar novo usuário |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/forgot-password` | Solicitar reset de senha |
| POST | `/api/auth/reset-password` | Resetar senha com token |
| GET | `/api/auth/me` | Obter usuário atual (auth) |
| POST | `/api/auth/change-password` | Alterar senha (auth) |

### Health
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Verificar status da API |

## Trocar Banco de Dados

A arquitetura usa o padrão Repository + Adapter, facilitando a troca de banco:

1. Crie um novo adapter em `backend/src/database/` implementando `DatabaseAdapter`
2. Adicione o case no `backend/src/database/index.ts`
3. Altere `DB_TYPE` no `.env`

Exemplo para PostgreSQL:
```typescript
// backend/src/database/PostgreSQLAdapter.ts
export class PostgreSQLAdapter implements DatabaseAdapter {
  // Implementar métodos...
}
```

## Estrutura de Camadas

```
Request → Controller → Service → Repository → Database Adapter → DB
```

- **Controller**: Recebe HTTP, valida input, retorna response
- **Service**: Lógica de negócio
- **Repository**: Abstração de acesso a dados
- **Database Adapter**: Implementação específica do banco
