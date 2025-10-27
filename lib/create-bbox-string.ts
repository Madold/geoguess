/**
 * Convierte una única coordenada central (lat, lng) en un string Bounding Box (bbox)
 * con un margen de delta.
 * * El formato retornado es: minLon,minLat,maxLon,maxLat
 * * @param lat La latitud del punto central.
 * @param lng La longitud del punto central.
 * @param delta El valor de desplazamiento para crear el cuadrado (por defecto: 0.002).
 * @returns Un string en formato "minLon,minLat,maxLon,maxLat".
 */
export const createBoundingBoxString = (
  lat: number,
  lng: number,
  delta: number = 0.01
): string => {
  // Cálculo de los límites (mínimo y máximo)
  const minLon = lng - delta;
  const minLat = lat - delta;
  const maxLon = lng + delta;
  const maxLat = lat + delta;

  // Se construye el string en el orden minLon,minLat,maxLon,maxLat
  // Se usa toFixed(6) para asegurar una precisión adecuada para coordenadas
  return `${minLon.toFixed(6)},${minLat.toFixed(6)},${maxLon.toFixed(
    6
  )},${maxLat.toFixed(6)}`;
};
