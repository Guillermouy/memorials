-- Coordenadas del cementerio, para llegar hasta el portón. Son distintas de
-- las del nicho, que llevan hasta la tumba dentro del predio.
--
-- Ambas columnas nacen nulas: un cementerio ya cargado no tiene por qué quedar
-- inválido porque nadie fue todavía a copiar el par desde Google Maps.
ALTER TABLE "cemeteries" ADD COLUMN "latitude" DOUBLE PRECISION;
ALTER TABLE "cemeteries" ADD COLUMN "longitude" DOUBLE PRECISION;
