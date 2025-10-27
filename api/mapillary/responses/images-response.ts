export interface ImagesResponse {
  id: string;
  geometry: Geometry;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}
