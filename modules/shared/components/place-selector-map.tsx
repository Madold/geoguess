"use client";
import { Map, Marker } from "mapbox-gl";
import { useLayoutEffect, useRef, useEffect } from "react";
import { useGameStore } from "@/lib/store";

interface Props {
  onMarkerPlaced?: (lng: number, lat: number) => void;
}

export const PlaceSelectorMap = ({ onMarkerPlaced }: Props) => {
  const mapRef = useRef<Map | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);
  const correctMarkerRef = useRef<Marker | null>(null);
  const lineLayerId = "distance-line";
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

      // Eliminar marcador anterior si existe
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }

      // Crear marcador azul para la respuesta del usuario
      const userMarker = new Marker({ color: "#3B82F6" })
        .setLngLat([lng, lat])
        .addTo(map);

      userMarkerRef.current = userMarker;

      onMarkerPlaced?.(lng, lat);
    });

    return () => {
      map.remove();
    };
  }, [hasAnswered, onMarkerPlaced]);

  // Mostrar la ubicación correcta y la línea cuando el usuario responda
  useEffect(() => {
    if (
      hasAnswered &&
      selectedCoordinates &&
      questions[currentQuestionIndex] &&
      mapRef.current
    ) {
      const map = mapRef.current;
      const correctLocation = questions[currentQuestionIndex].location;

      // Función para añadir todos los marcadores
      const addMarkers = () => {
        // Asegurarse de que el marcador azul del usuario esté visible
        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
        }
        const userMarker = new Marker({ color: "#3B82F6" })
          .setLngLat([selectedCoordinates.lng, selectedCoordinates.lat])
          .addTo(map);
        userMarkerRef.current = userMarker;

        // Crear marcador verde para la ubicación correcta
        if (correctMarkerRef.current) {
          correctMarkerRef.current.remove();
        }
        const correctMarker = new Marker({ color: "#10B981" })
          .setLngLat([correctLocation.longitude, correctLocation.latitude])
          .addTo(map);
        correctMarkerRef.current = correctMarker;
      };

      // Agregar marcadores
      addMarkers();

      // Agregar línea conectando ambos puntos
      const geojson = {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            geometry: {
              type: "LineString" as const,
              coordinates: [
                [selectedCoordinates.lng, selectedCoordinates.lat],
                [correctLocation.longitude, correctLocation.latitude],
              ],
            },
            properties: {},
          },
        ],
      };

      // Esperar a que el mapa esté completamente cargado
      if (map.isStyleLoaded()) {
        addLineToMap(map, geojson);
      } else {
        map.once("style.load", () => {
          addLineToMap(map, geojson);
          // Re-agregar marcadores después de que se cargue el estilo
          addMarkers();
        });
      }
    }
  }, [hasAnswered, selectedCoordinates, questions, currentQuestionIndex]);

  // Función auxiliar para agregar la línea al mapa
  const addLineToMap = (map: Map, geojson: any) => {
    // Eliminar capa y fuente anterior si existen
    if (map.getLayer(lineLayerId)) {
      map.removeLayer(lineLayerId);
    }
    if (map.getSource(lineLayerId)) {
      map.removeSource(lineLayerId);
    }

    // Agregar fuente y capa
    map.addSource(lineLayerId, {
      type: "geojson",
      data: geojson,
    });

    map.addLayer({
      id: lineLayerId,
      type: "line",
      source: lineLayerId,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#EF4444",
        "line-width": 3,
        "line-dasharray": [2, 2],
      },
    });
  };

  // Limpiar los marcadores y la línea cuando cambie de pregunta
  useEffect(() => {
    if (!selectedCoordinates && !hasAnswered) {
      // Limpiar marcador del usuario
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      // Limpiar marcador correcto
      if (correctMarkerRef.current) {
        correctMarkerRef.current.remove();
        correctMarkerRef.current = null;
      }
      // Limpiar línea
      if (mapRef.current) {
        const map = mapRef.current;
        if (map.getLayer(lineLayerId)) {
          map.removeLayer(lineLayerId);
        }
        if (map.getSource(lineLayerId)) {
          map.removeSource(lineLayerId);
        }
      }
    }
  }, [selectedCoordinates, hasAnswered]);

  return <div ref={mapDiv} className="w-full h-[600px] rounded-lg my-3"></div>;
};
