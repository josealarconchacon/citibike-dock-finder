import { LazyStationMap } from "@/components/LazyStationMap";
import { StationFinder } from "@/components/StationFinder";
import { StationList } from "@/components/StationList";
import { getNearbyStations } from "@/lib/data";
import { parseQuery } from "@/lib/query";

export default async function Home({ searchParams }: PageProps<"/">) {
  const query = parseQuery(await searchParams);
  const { stations, origin, mode, usingDefaultLocation, outsideServiceArea, updatedAt } =
    await getNearbyStations(query);

  // Outside the service area there is nothing to map, so the list explains why.
  const showMap = query.view === "map" && !outsideServiceArea;

  return (
    <StationFinder
      mode={mode}
      view={query.view}
      origin={usingDefaultLocation ? undefined : origin}
      updatedAt={updatedAt}
    >
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
