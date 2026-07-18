import React, { useCallback, useEffect, useRef } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";

const PAKISTAN_CENTER = { lat: 30.3753, lng: 69.3451 };
const DEFAULT_ZOOM = 5;
const SELECTED_ZOOM = 16;

const MAP_OPTIONS = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  clickableIcons: false,
};

const reverseGeocode = (lat, lng) =>
  new Promise((resolve) => {
    if (!window.google?.maps) return resolve(null);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        resolve(results[0].formatted_address);
      } else {
        resolve(null);
      }
    });
  });

const MapPicker = ({ value, onChange, isLoaded }) => {
  const mapRef = useRef(null);

  const position =
    value?.lat != null && value?.lng != null
      ? { lat: Number(value.lat), lng: Number(value.lng) }
      : null;

  useEffect(() => {
    if (mapRef.current && position) {
      mapRef.current.panTo(position);
      mapRef.current.setZoom(SELECTED_ZOOM);
    }
  }, [position?.lat, position?.lng]);

  const pickPoint = useCallback(
    async (lat, lng) => {
      const address = await reverseGeocode(lat, lng);
      onChange?.({ lat, lng, address });
    },
    [onChange]
  );

  const handleMapClick = (e) => {
    pickPoint(e.latLng.lat(), e.latLng.lng());
  };

  const handleMarkerDragEnd = (e) => {
    pickPoint(e.latLng.lat(), e.latLng.lng());
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-[300px] rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full h-[300px] rounded-2xl overflow-hidden border border-gray-200">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={position || PAKISTAN_CENTER}
          zoom={position ? SELECTED_ZOOM : DEFAULT_ZOOM}
          options={MAP_OPTIONS}
          onClick={handleMapClick}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onUnmount={() => {
            mapRef.current = null;
          }}
        >
          {position && (
            <MarkerF
              position={position}
              draggable
              onDragEnd={handleMarkerDragEnd}
            />
          )}
        </GoogleMap>
      </div>

      {position ? (
        <p className="text-xs text-gray-500 mt-2">
          Pinned: {position.lat.toFixed(6)}, {position.lng.toFixed(6)} — drag
          the marker or click on the map to adjust
        </p>
      ) : (
        <p className="text-xs text-gray-400 mt-2">
          Type an address above or click on the map to drop a pin
        </p>
      )}
    </div>
  );
};

export default MapPicker;