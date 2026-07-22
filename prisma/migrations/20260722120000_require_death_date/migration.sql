-- La fecha de fallecimiento pasa a ser obligatoria: es lo que ordena a las
-- personas de un nicho y el eje de la página conmemorativa.
--
-- No hace falta backfill: antes de escribir esta migración se verificó que las
-- filas existentes ya tenían el dato (3 personas, 0 sin fecha). Si en otra base
-- hubiera nulos, el ALTER falla sin dejar la tabla a medias — hay que completar
-- esas fechas primero.
ALTER TABLE "people" ALTER COLUMN "deathDate" SET NOT NULL;
