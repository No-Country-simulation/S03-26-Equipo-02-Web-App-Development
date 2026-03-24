# 🚀 CRM Backend — NestJS + PostgreSQL + Redis

Backend del proyecto S03-26, construido con **NestJS**, **TypeORM**, **PostgreSQL** e **ioredis**.

---

## 🧱 Requisitos

- Node.js 20+
- npm
- Acceso a una instancia de **PostgreSQL** y una de **Redis** (local o remota)

---

## ⚙️ Instalación

```bash
cd server
npm install
```

---

## 🗄️ Variables de entorno

Copiá el archivo de ejemplo y completá tus valores:

```bash
cp .env.example .env
```

### Variables requeridas

```env
# Server
PORT=3000
NODE_ENV=development

# PostgreSQL
DATABASE_URL

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=default
REDIS_PASSWORD=
REDIS_TLS=false
```

---

## ▶️ Levantar el servidor

```bash
# Desarrollo (hot reload)
npm run start:dev

# Producción
npm run start:prod
```

El servidor queda disponible en: [http://localhost:3000](http://localhost:3000)
Recomendacion levantarlo en el puerto 3001 para que el forntend pueda levantarle en el 3000 o otro puerto si usa Vite.

---

## 🧪 Endpoints de prueba (Health Checks)

| Método | Ruta          | Descripción                          |
|--------|---------------|--------------------------------------|
| GET    | `/health`     | Verifica que el servidor esté activo |
| GET    | `/health/db`  | Verifica la conexión con PostgreSQL  |
| GET    | `/health/redis` | Verifica la conexión con Redis     |

### Ejemplos de respuesta exitosa

**`GET /health`**

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "message": "El servidor está funcionando correctamente",
    "timestamp": "2025-01-01T00:00:00.000Z",
    "environment": "development"
  }
}
```

**`GET /health/db`**

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "message": "PostgreSQL conectado correctamente",
    "timestamp": "2025-01-01T00:00:00.000Z"
  }
}
```

**`GET /health/redis`**

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "message": "Redis conectado correctamente",
    "ping": "PONG",
    "timestamp": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## 📂 Archivo HTTP de pruebas

Los archivos `.http` para probar los endpoints están en:

```
server/doc/health.http
```

> Requiere la extensión **REST Client** en VS Code (`humao.rest-client`).

Para usarlos: abrí el archivo `server/doc/health.http` en VS Code y hacé clic en **"Send Request"** sobre cada bloque.

---

## 🧼 Formato de respuestas

Todas las respuestas pasan por el `ResponseInterceptor` global (`src/common/response/`):

```json
{
  "success": true,
  "data": { ... }
}
```

---

## ❌ Manejo global de errores

Los errores pasan por el `HttpExceptionFilter` global (`src/common/http-exception/`):

```json
{
  "success": false,
  "error": "Mensaje de error"
}
```

---

## 🏗️ Estructura del proyecto

```
server/
├── doc/
│   └── health.http          ← Archivo HTTP para pruebas manuales
├── src/
│   ├── common/
│   │   ├── http-exception/  ← Filtro global de errores
│   │   └── response/        ← Interceptor global de respuestas
│   ├── app.module.ts        ← Módulo raíz (TypeORM + Redis)
│   ├── app.controller.ts    ← Health check endpoints
│   ├── app.service.ts       ← Lógica de health checks
│   └── main.ts              ← Bootstrap (pipes, filtros, interceptors)
├── .env                     ← Variables de entorno (no commitear)
├── .env.example             ← Plantilla de variables
└── package.json
```

---

## 📦 Dependencias principales

| Paquete | Uso |
|---|---|
| `@nestjs/typeorm` + `typeorm` + `pg` | ORM para PostgreSQL |
| `ioredis` | Cliente Redis |
| `@nestjs/config` | Variables de entorno |
| `class-validator` + `class-transformer` | Validación de DTOs |

---

## 📌 Notas

- `synchronize: false` en TypeORM — las migraciones se manejan manualmente
- El cliente Redis se inyecta con el token `'REDIS_CLIENT'`
- Los filtros e interceptores globales están registrados en `main.ts`
