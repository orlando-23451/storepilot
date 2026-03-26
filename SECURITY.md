# SECURITY.md

## Propósito
Definir los controles obligatorios de seguridad para cualquier proyecto que use este estándar.

## Principios de seguridad
- seguridad por defecto,
- privilegio mínimo,
- validación temprana,
- secretos fuera del código,
- defensa en profundidad,
- trazabilidad y auditoría,
- falla segura,
- separación clara entre ambientes.

## Manejo de secretos
### Reglas obligatorias
- Nunca solicitar ni aceptar secretos reales dentro del chat, código o documentación.
- Nunca hardcodear:
  - API keys
  - passwords
  - tokens
  - certificados privados
  - connection strings reales
- Toda configuración sensible debe ir en:
  - `.env`
  - `.env.dev`
  - `.env.qa`
  - `.env.production`
  - `.env.example` con placeholders
- Si existe infraestructura compatible, usar vault o equivalente.

## Ambientes
- Separar claramente `dev`, `qa` y `prod`.
- No reutilizar bases o credenciales de producción para desarrollo.
- Nunca activar debugging en producción.
- El sistema debe detenerse si detecta `DEBUGGING=true` en producción.

## Vulnerabilidades a prevenir
El sistema debe prevenir o mitigar al menos:
- SQL Injection
- CSRF/XSRF
- XSS
- IDOR
- exposición de secretos
- escalación de privilegios
- configuración insegura
- bypass de autenticación
- uso indebido de debugging en producción
- CORS demasiado permisivo sin justificación

## Seguridad del API
### Controles mínimos
- Validación obligatoria de toda entrada con Joi u otro validador aprobado.
- Uso de consultas parametrizadas.
- Control de autenticación y autorización según el contexto del proyecto.
- Rutas públicas y privadas claramente delimitadas.
- Respuestas consistentes sin exponer trazas internas.
- Manejo de errores con mensajes seguros para el usuario.

### Headers y hardening
- Usar Helmet o equivalente.
- Configurar políticas de seguridad razonables:
  - `Content-Security-Policy`
  - `X-Frame-Options` o `frameguard`
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `HSTS`
  - `Permissions-Policy`
- Documentar excepciones necesarias para Swagger u otros assets de documentación.

## Autenticación y autorización
### Reglas base
- Definir roles y permisos desde `REQUIREMENTS.md`.
- Aplicar control de acceso por caso de uso y por ruta.
- No confiar en el front end como única barrera de autorización.
- El back end debe verificar permisos siempre que corresponda.
- Proteger documentación sensible del API si aplica.

## Seguridad de base de datos
### Reglas obligatorias
- Usuario de base de datos con privilegios acotados:
  - `SELECT`
  - `INSERT`
  - `UPDATE`
  - `DELETE`
  - `INDEX`
- Sin privilegios administrativos estructurales para el usuario de la aplicación.
- Toda tabla debe permitir trazabilidad mínima con:
  - `active`
  - `creation_date`
  - `last_update_date`
- El sistema debe usar borrado lógico.
- No usar stored procedures para lógica de negocio.

### Certificados
- Si la conexión requiere certificados, estos deben vivir en `cert/`.
- Deben existir variantes por ambiente cuando aplique.

## Logging y auditoría
### Logging
- Registrar eventos relevantes sin exponer secretos.
- Evitar logs con tokens, passwords, payloads sensibles o PII sin necesidad.
- Mantener logging útil para soporte y diagnóstico.

### Auditoría
Cuando el dominio del proyecto lo requiera, registrar:
- alta de registros,
- modificaciones relevantes,
- bajas lógicas,
- cambios de permisos,
- eventos de autenticación,
- acciones sensibles del usuario.

## Datos sensibles y privacidad
Si el proyecto maneja datos sensibles:
- documentar clases de datos,
- definir retención,
- aplicar cifrado en tránsito,
- aplicar cifrado en reposo cuando sea necesario,
- restringir exposición de PII,
- definir reglas de exportación, respaldo y eliminación.

## Integraciones externas
- Documentar auth scheme sin revelar secretos.
- Definir timeouts, retries y manejo seguro de errores.
- Si no existe integración real, usar `MOCK_EXTERNAL_SERVICES`.
- No asumir respuestas externas confiables; validar siempre.

## Seguridad de front end
- No almacenar información sensible en lugares inseguros si puede evitarse.
- Evitar exponer detalles internos del API.
- Manejar expiración de sesión y errores 401 de forma segura.
- No basar la autorización real únicamente en el front end.

## Seguridad de dependencias
- Priorizar librerías seguras, vigentes y compatibles.
- Evitar dependencias sin mantenimiento o de baja reputación.
- Justificar nuevas dependencias.
- Revisar impacto de actualización de librerías críticas.

## Checklist mínimo de seguridad
Antes de liberar:
- no hay secretos en el repositorio,
- existe `.env.example`,
- entradas validadas,
- consultas parametrizadas,
- roles y permisos revisados,
- debugging desactivado en producción,
- Swagger protegido si corresponde,
- CORS revisado,
- headers de seguridad activos,
- logs sin exposición de datos sensibles,
- usuario de base de datos con privilegio mínimo.

## Definition of Done de seguridad
Una entrega cumple seguridad mínima si:
- no expone secretos,
- valida entradas,
- usa consultas parametrizadas,
- controla acceso según roles,
- evita borrado físico funcional,
- protege ambientes,
- documenta configuración sensible sin revelar valores reales.
