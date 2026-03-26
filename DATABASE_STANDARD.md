# DATABASE_STANDARD.md

## Propósito
Definir reglas obligatorias para modelado, persistencia y operación de MySQL en proyectos del estándar.

## Motor y archivo principal
- Motor: MySQL
- Archivo obligatorio: `sql/schema.sql`

## Contenido obligatorio de `schema.sql`
- `CREATE DATABASE`
- tablas
- relaciones
- índices
- datos de prueba
- usuario restringido para conexión del sistema
- grants mínimos requeridos

## Convenciones de tablas
Toda tabla debe tener:
1. primary key única
2. primary key numérica y autoincremental
3. nombre con patrón `singular_id`
4. columna `active`
5. columna `creation_date`
6. columna `last_update_date`

## Borrado lógico
No debe existir borrado funcional físico.
La baja se resuelve mediante:
```sql
UPDATE table_name SET active = 0;
```

Toda consulta funcional debe considerar:
```sql
WHERE active = 1
```

## Relaciones
- Declarar llaves foráneas cuando aplique.
- Documentar relaciones importantes en `REQUIREMENTS.md` o `ARCHITECTURE.md`.
- Evitar relaciones ambiguas o sin índice cuando afecten performance.

## Lógica de negocio
- No usar stored procedures para lógica de negocio.
- La lógica debe vivir en el API.
- La base de datos persiste, no decide procesos de negocio complejos.

## Datos bilingües
Cuando el dominio lo requiera, soportar columnas como:
- `name_es`
- `name_en`

o equivalentes semánticos.

## Usuario de aplicación
Debe crearse un usuario de base de datos restringido con permisos mínimos necesarios para la app.

## Datos de prueba
`schema.sql` debe incluir inserts útiles para que el sistema muestre información visible al instalarse.

## Seguridad de conexión
- usar certificados desde `cert/` cuando aplique,
- separar configuración por ambiente,
- no exponer credenciales reales.

## Utilerías del backend
`src/system/mysql.js` debe concentrar acceso reusable a MySQL, incluyendo:
- inicialización del pool,
- queries parametrizados,
- helpers de insert/update,
- manejo consistente de fechas.

## Checklist de base de datos
- esquema reproducible,
- datos de prueba presentes,
- usuario restringido definido,
- tablas con columnas estándar,
- borrado lógico aplicado,
- sin stored procedures de negocio.
