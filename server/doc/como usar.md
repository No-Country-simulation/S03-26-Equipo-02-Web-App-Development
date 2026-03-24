# Documentacion request.http

¿Qué es request.http?

request.http es un archivo especial que permite probar y documentar endpoints HTTP directamente desde el editor de código, sin necesidad de usar herramientas externas como Postman.

Es una forma simple y práctica de:

Probar endpoints (GET, POST, PUT, DELETE)

Enviar datos JSON o archivos

Ver respuestas del servidor

Compartir ejemplos de uso de la API con el equipo

Mantener documentación viva dentro del proyecto

## 🚀 ¿Qué necesito para usarlo?

Solo necesitas:

Visual Studio Code

Extensión REST Client

Ejemplos:

```json
### Obtener todos los caballos
GET http://localhost:3000/api/horses


### Crear caballo
POST http://localhost:3000/api/horses
Content-Type: application/json

{
  "name": "tornado",
  "breed": "arabian",
  "age": 5
}
```

Cuando hagas clic en Send Request, VS Code ejecutará la petición y mostrará la respuesta debajo.
