"use client";
import { Map, Marker } from "mapbox-gl";
import { useLayoutEffect, useRef } from "react";

export const PlaceSelectorMap = () => {
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const mapDiv = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const map = new Map({
      container: mapDiv.current!,
      style: "mapbox://styles/mapbox/standard",
      center: [0, 0],
      zoom: 0.1,
    });

    mapRef.current = map;

    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;

      if (markerRef.current) {
        markerRef.current.remove();
      }

      const newMarker = new Marker().setLngLat([lng, lat]).addTo(map);

      markerRef.current = newMarker;
    });

    return () => {
      map.remove();
    };
  }, []);

  return <div ref={mapDiv} className="w-full h-[600px] rounded-lg"></div>;
};
