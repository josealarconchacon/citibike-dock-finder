import { cookies } from "next/headers";
import { FavoriteStations } from "@/components/FavoriteStations";
import { LazyStationMap } from "@/components/LazyStationMap";
import { StationFinder } from "@/components/StationFinder";
import { StationList } from "@/components/StationList";
import { getAllStations, getNearbyStations } from "@/lib/data";
import { FAVORITES_COOKIE, parseFavorites, pickFavorites } from "@/lib/favorites";
import { parseQuery } from "@/lib/query";

export default async function Home({ searchParams }: PageProps<"/">) {
  const query = parseQuery(await searchParams);
  const { stations, origin, mode, usingDefaultLocation, outsideServiceArea, updatedAt } =
    await getNearbyStations(query);

  // Saved stations come from a cookie, and use the same cached feed as the list.
  const cookieStore = await cookies();
  const favoriteIds = parseFavorites(cookieStore.get(FAVORITES_COOKIE)?.value);
  const { stations: allStations } = await getAllStations();
  const favorites = pickFavorites(allStations, favoriteIds);
  const stationNames = [...new Set(allStations.map((station) => station.name))].sort();

  // Outside the service area there is nothing to map, so the list explains why.
  const showMap = query.view === "map" && !outsideServiceArea;

  return (
    <StationFinder
      mode={mode}
      view={query.view}
      origin={usingDefaultLocation ? undefined : origin}
      updatedAt={updatedAt}
    >
      <FavoriteStations
        favorites={favorites}
        stationNames={stationNames}
        origin={origin}
        mode={mode}
      />
      {showMap ? (
        <LazyStationMap
          stations={stations}
          origin={origin}
          mode={mode}
          usingDefaultLocation={usingDefaultLocation}
        />
      ) : (
        <StationList stations={stations} mode={mode} outsideServiceArea={outsideServiceArea} />
      )}
    </StationFinder>
  );
}
