"use client";

import "leaflet/dist/leaflet.css";
import { divIcon, type LatLngTuple } from "leaflet";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { DEFAULT_LOCATION_LABEL, MAP_ATTRIBUTION, MAP_TILE_URL } from "@/lib/constants";
import { formatDistance, walkingMinutes } from "@/lib/distance";
import { availabilityText, usefulCount } from "@/lib/format";
import { statusStyles } from "@/lib/status";
import type { LatLon, Mode, NearbyStation } from "@/types/station";

function stationIcon(count: number) {
  return divIcon({
    className: "",
    // Dark text, because white text is too faint on the bright status colors.
    html: `<span class="flex size-8 items-center justify-center rounded-full border-2 border-white text-sm font-bold text-page shadow-md ${
      statusStyles(count).dot
    }">${count}</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

const originIcon = divIcon({
  className: "",
  html: '<span class="block size-4 rounded-full border-2 border-white bg-sky-600 shadow-md ring-4 ring-sky-600/30"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function FitBounds({ points }: { points: LatLngTuple[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView(points[0], 15);
      return;
    }

    map.fitBounds(points, { padding: [40, 40], maxZoom: 17 });
  }, [map, points]);

  return null;
}

export function StationMap({
  stations,
  origin,
  mode,
  usingDefaultLocation,
}: {
  stations: NearbyStation[];
  origin: LatLon;
  mode: Mode;
  usingDefaultLocation: boolean;
}) {
  // useMemo keeps the same array between re-renders, so FitBounds only re-zooms on new data.
  const points = useMemo<LatLngTuple[]>(
    () => [[origin.lat, origin.lon], ...stations.map((s): LatLngTuple => [s.lat, s.lon])],
    [origin, stations],
  );

  const originLabel = usingDefaultLocation ? DEFAULT_LOCATION_LABEL : "Your location";

  return (
    <div>
      <div role="region" aria-label="Map of the nearest stations">
        <MapContainer
          center={[origin.lat, origin.lon]}
          zoom={15}
          // +/- buttons or pinch instead.
          scrollWheelZoom={false}
          className="h-[60dvh] min-h-80 w-full rounded-card border border-line"
        >
          <TileLayer url={MAP_TILE_URL} attribution={MAP_ATTRIBUTION} />
          <FitBounds points={points} />

          <Marker
            position={[origin.lat, origin.lon]}
            icon={originIcon}
            title={originLabel}
            zIndexOffset={1000}
          >
            <Popup>{originLabel}</Popup>
          </Marker>

          {stations.map((station) => (
            <Marker
              key={station.id}
              position={[station.lat, station.lon]}
              icon={stationIcon(usefulCount(station, mode))}
              title={`${station.name}: ${availabilityText(station, mode)}`}
            >
              <Popup>
                <div className="space-y-1 text-sm">
                  <strong className="block">{station.name}</strong>
                  <span className="block">{availabilityText(station, mode)}</span>
                  <span className="block text-slate-600">
                    {formatDistance(station.distanceMeters)} ·{" "}
                    {walkingMinutes(station.distanceMeters)} min walk
                  </span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${station.lat},${station.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-semibold"
                    aria-label={`Walking directions to ${station.name}`}
                  >
                    Walking directions
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <ul
        aria-label="Map legend"
        className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted"
      >
        <li>Numbers show {mode === "dock" ? "open docks" : "available bikes"}</li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-3 rounded-full bg-sky-600" /> {originLabel}
        </li>
      </ul>
    </div>
  );
}
