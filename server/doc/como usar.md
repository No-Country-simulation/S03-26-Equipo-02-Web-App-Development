# 📖 Guía del CRM — WhatsApp, Twilio, Ngrok & Mensajería

Este documento centraliza todo lo que necesitás saber para entender, probar y opinar sobre la integración de WhatsApp con Twilio en este CRM. También explica cómo funciona el archivo `.http` para probar la API sin Postman.

---

## 🗂️ Tabla de Contenidos

1. [¿Qué son los archivos `.http`?](#-qué-son-los-archivos-http)
2. [¿Qué es ese número `+14155238886` en el `.env`?](#-qué-es-ese-número-14155238886-en-el-env)
3. [¿Puedo responderle a un cliente desde mi WhatsApp personal?](#-puedo-responderle-a-un-cliente-desde-mi-whatsapp-personal)
4. [¿Cómo recibo mensajes de mis clientes?](#-cómo-recibo-mensajes-de-mis-clientes)
5. [¿Cómo respondo desde el CRM?](#-cómo-respondo-desde-el-crm)
6. [Flujo automático de mensajes (BullMQ + Redis)](#-flujo-automático-de-mensajes)
7. [Ngrok — ¿qué es y para qué sirve?](#-ngrok--qué-es-y-para-qué-sirve)
8. [Tabla de endpoints disponibles](#-endpoints-disponibles)
9. [Variables de entorno de Twilio explicadas](#-variables-de-entorno-de-twilio-explicadas)
10. [Próximos pasos: Email](#-próximos-pasos-email)

---

## 📄 ¿Qué son los archivos `.http`?

Los archivos `.http` permiten probar y documentar endpoints HTTP directamente desde VS Code, sin necesidad de Postman ni otras herramientas externas.

**Requisitos:**

- Visual Studio Code
- Extensión **REST Client** (buscarla en el marketplace de VS Code)

**Uso:** Abrí cualquier archivo `.http` de la carpeta `doc/` y hacé clic en `Send Request` sobre cada petición.

**Archivos disponibles:**

| Archivo | Contenido |
| :--- | :--- |
| `doc/health.http` | Verificar estado del servidor, DB y Redis |
| `doc/contacts.http` | CRUD completo de contactos |
| `doc/twilio.http` | Envío y recepción de mensajes de WhatsApp |

**Ejemplo básico:**

```http
### Obtener todos los contactos
GET http://localhost:3001/contacts

### Crear un contacto
POST http://localhost:3001/contacts
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+...."
}
```

---

## 📞 ¿Qué es ese número `+14..` en el ``?



Ese número **no pertenece a tu empresa**. Es el **número del Sandbox de Twilio**: un número compartido y gratuito que Twilio presta a todos los desarrolladores para hacer pruebas sin costo.

Funciona así según el entorno:

| Entorno | Número que usa el CRM | Quién lo provee |
| :--- | :--- | :--- |
| **Desarrollo** | `+14....` | Twilio (Sandbox gratuito, compartido) |
| **Producción** | `+5.... XXX XXX XXXX` (tu número real) | Vos, registrado y aprobado por Meta/Twilio |

Cuando el proyecto llegue a producción, registrás tu propio número de WhatsApp Business en Twilio y cambiás esa variable:

---

## 💬 ¿Puedo responderle a un cliente desde mi WhatsApp personal?

**No, y eso es intencional.** En un CRM el canal de comunicación es siempre el sistema centralizado, no el teléfono personal de nadie. El flujo correcto es:

``` 
Cliente escribe por WhatsApp
         ↓
Twilio recibe el mensaje y llama al webhook del CRM
         ↓
El mensaje se guarda en la base de datos
         ↓
El agente ve la conversación en el panel del CRM (frontend)
         ↓
El agente responde desde el CRM → Twilio → WhatsApp del cliente
```

Tu WhatsApp personal queda completamente afuera. Esto es una ventaja: todas las conversaciones quedan registradas, asignadas y disponibles para todo el equipo, sin depender de teléfonos individuales.

> **¿Querés probar el envío a un número real?**  
> Usá el endpoint `POST /twilio/send` (ver más abajo). Sí podés enviarle a tu propio número de WhatsApp para testear, siempre que ese número haya activado el Sandbox de Twilio primero.

---

## 📱 ¿Cómo recibo mensajes de mis clientes?

Para que los mensajes lleguen al CRM:

**En desarrollo (Sandbox):**

1. El cliente (o cualquier número de prueba) debe enviar primero un mensaje de activación al número `+1 415 523 8886` con la palabra clave de tu Sandbox.  
   Ejemplo: `join <tu-palabra-clave>`  
   *(La palabra clave específica está en: Twilio Console → Messaging → Try it out → Send a WhatsApp message)*

2. Una vez activado, cualquier mensaje que ese número envíe llegará al webhook del CRM.

3. El sistema lo procesa automáticamente (ver sección de Flujo más abajo).

**En producción:**

No hace falta activación previa. Cualquier persona puede escribirle directamente a tu número oficial de WhatsApp Business.

---

## ✉️ ¿Cómo respondo desde el CRM?

Para responder a un cliente, el sistema llama al endpoint de envío. Podés probarlo directamente desde `doc/twilio.http`:

```http
POST http://localhost:3001/twilio/send
Content-Type: application/json

{
  "to": "+.....",
  "body": "¡Hola! Recibimos tu mensaje, ¿en qué te podemos ayudar?"
}
```

> ⚠️ **Ventana de 24 horas de WhatsApp:** Solo podés enviar mensajes de texto libre si el cliente te escribió en las últimas 24 horas. Si pasó más tiempo, debés usar una **plantilla aprobada** (`POST /twilio/send-template`). Esto es una restricción de WhatsApp, no del CRM.

---

## ⚙️ Flujo Automático de Mensajes

Cuando un cliente escribe por WhatsApp, el sistema hace lo siguiente de forma completamente automática:

```
1. Twilio recibe el mensaje
         ↓
2. Llama a POST /twilio/webhook
         ↓
3. El webhook encola el mensaje en Redis (BullMQ — cola "whatsapp-messages")
         ↓
4. El Processor desencola y ejecuta:
   ├── Busca si existe un Contacto con ese número de teléfono
   ├── Si no existe → crea el Contacto con segmentType: LEAD
   ├── Busca o crea el Canal "whatsapp"
   └── Guarda el Mensaje en la DB (direction: "received")
```

El uso de una **cola (BullMQ + Redis)** es importante: si llegan muchos mensajes al mismo tiempo, el webhook responde instantáneamente a Twilio (que exige respuesta rápida) y el procesamiento pesado se hace en segundo plano sin perder ningún mensaje.

---

## 🌐 Ngrok — ¿Qué es y para qué sirve?

Twilio necesita llamar al webhook del CRM cuando llega un mensaje. El problema es que en desarrollo el servidor corre en `localhost`, que no es accesible desde internet.

**Ngrok** crea un túnel temporal que expone tu servidor local con una URL pública real:

```
Internet → https://....ngrok-free.app → localhost:3001
```

**Cómo usarlo:**

1. Conseguí tu token gratuito en [dashboard.ngrok.com](https://dashboard.ngrok.com/get-started/your-authtoken)
2. Pegalo en el `.env`:
3. Levantá el servidor con:
   ```bash
   npm run start:dev:ngrok
   ```
4. En consola vas a ver algo así:
   ```
   [Ngrok] Túnel activo: https://....ngrok-free.app
   [Ngrok] Webhook Twilio → https://......ngrok-free.app/twilio/webhook
   ```
5. Copiá esa URL y pegala en Twilio Console:
   > Messaging → Sandbox Settings → **WHEN A MESSAGE COMES IN**  
   > URL: `https://......ngrok-free.app/twilio/webhook`  
   > Method: `HTTP POST`

> **En producción** no se usa ngrok. Twilio apunta directamente al dominio del servidor desplegado. Ngrok solo existe como devDependency y solo se activa si `USE_NGROK=true` **y** `NODE_ENV=development`.

---

## 🔗 Endpoints Disponibles

Todos se pueden probar desde `doc/twilio.http`.

### Envío de mensajes

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `POST` | `/twilio/send` | Envía un mensaje de texto libre a un número de WhatsApp |
| `POST` | `/twilio/send-template` | Envía un mensaje con plantilla aprobada de Twilio |

### Recepción (webhook)

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `POST` | `/twilio/webhook` | Twilio llama aquí cuando llega un mensaje. También sirve para simular mensajes en local |

### Consulta de historial

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/twilio/messages` | Lista todos los mensajes guardados (enviados y recibidos) |
| `GET` | `/twilio/messages/contact/:phone` | Lista el historial de conversación de un contacto específico |

---

## 🔑

```
cessor que guarda el correo y lo vincula al contacto
- Canal `email` en la entidad `Channel`
- Endpoints similares: `POST /email/send`, `GET /email/messages`, etc.

La arquitectura actual ya está preparada para recibirlo sin cambios mayores.
