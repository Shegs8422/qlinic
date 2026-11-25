import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon } from "@hugeicons/core-free-icons";
import type { Clinic } from "../types";

interface GoogleMapPreviewProps {
  clinic: Clinic;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

let googleMapsLoader: Promise<void> | null = null;

function loadGoogleMaps() {
  if (typeof window === "undefined") return Promise.resolve();
  const googleWindow = window as typeof window & {
    google?: {
      maps?: {
        Map: new (element: HTMLElement, options: Record<string, unknown>) => unknown;
        Marker: new (options: Record<string, unknown>) => unknown;
      };
    };
  };

  if (googleWindow.google?.maps) return Promise.resolve();
  if (googleMapsLoader) return googleMapsLoader;

  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(new Error("Google Maps API key not configured"));
  }

  googleMapsLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(script);
  });

  return googleMapsLoader;
}

export function GoogleMapPreview({ clinic }: GoogleMapPreviewProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    let active = true;

    loadGoogleMaps()
      .then(() => {
        if (!active || !mapElement.current) return;
        const google = (window as typeof window & {
          google: {
            maps: {
              Map: new (element: HTMLElement, options: Record<string, unknown>) => unknown;
              Marker: new (options: Record<string, unknown>) => unknown;
            };
          };
        }).google;
        const position = { lat: clinic.latitude, lng: clinic.longitude };
        const map = new google.maps.Map(mapElement.current, {
          center: position,
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "cooperative",
          clickableIcons: false,
        });
        new google.maps.Marker({ position, map, title: clinic.name });
      })
      .catch(() => {
        if (active) setMapError(true);
      });

    return () => {
      active = false;
    };
  }, [clinic]);

  return (
    <div className="map-preview" aria-label={`Map showing ${clinic.name}`}>
      <div ref={mapElement} className="map-preview__canvas" />
      {mapError && (
        <div className="map-preview__fallback">
          <HugeiconsIcon icon={Location01Icon} size={22} />
          <span>Map preview unavailable</span>
        </div>
      )}
    </div>
  );
}
