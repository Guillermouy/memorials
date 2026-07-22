/// Orden en que se listan las personas de un nicho: el fallecimiento más
/// reciente arriba, el más antiguo abajo.
///
/// Un nicho familiar se llena a lo largo de décadas, y quien escanea el QR
/// suele venir por la última despedida. Ordenar por `createdAt` mostraba el
/// orden en que alguien cargó los datos, que no significa nada para el visitante.
export const peopleByDeathDate = { deathDate: "desc" } as const;
