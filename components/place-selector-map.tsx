"use client";
import { Map, Marker } from "mapbox-gl";
import { useLayoutEffect, useRef, useEffect } from "react";
import { useGameStore } from "@/lib/store";

interface Props {
  onMarkerPlaced?: (lng: number, lat: number) => void;
}

export const PlaceSelectorMap = ({ onMarkerPlaced }: Props) => {
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const correctMarkerRef = useRef<Marker | null>(null);
  const mapDiv = useRef<HTMLDivElement>(null);

  const { selectedCoordinates, hasAnswered, questions, currentQuestionIndex } =
    useGameStore();

  useLayoutEffect(() => {
    const map = new Map({
      container: mapDiv.current!,
      style: "mapbox://styles/mapbox/standard",
      center: [0, 0],
      zoom: 0.1,
    });

    mapRef.current = map;

    map.on("click", (e) => {
      // No permitir colocar marcador si ya respondió
      if (hasAnswered) return;

      const { lng, lat } = e.lngLat;

      if (markerRef.current) {
        markerRef.current.remove();
      }

      const newMarker = new Marker({ color: "#3B82F6" })
        .setLngLat([lng, lat])
        .addTo(map);

      markerRef.current = newMarker;

      onMarkerPlaced?.(lng, lat);
    });

    return () => {
      map.remove();
    };
  }, [hasAnswered, onMarkerPlaced]);

  // Mostrar la ubicación correcta cuando el usuario responda
  useEffect(() => {
    if (hasAnswered && questions[currentQuestionIndex] && mapRef.current) {
      const correctLocation = questions[currentQuestionIndex].location;

      // Crear marcador verde para la ubicación correcta
      if (correctMarkerRef.current) {
        correctMarkerRef.current.remove();
      }

      const correctMarker = new Marker({ color: "#10B981" })
        .setLngLat([correctLocation.longitude, correctLocation.latitude])
        .addTo(mapRef.current);

      correctMarkerRef.current = correctMarker;
    }
  }, [hasAnswered, questions, currentQuestionIndex]);

  // Limpiar los marcadores cuando cambie de pregunta
  useEffect(() => {
    if (!selectedCoordinates) {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (correctMarkerRef.current) {
        correctMarkerRef.current.remove();
        correctMarkerRef.current = null;
      }
    }
  }, [selectedCoordinates]);

  return <div ref={mapDiv} className="w-full h-[600px] rounded-lg"></div>;
};
