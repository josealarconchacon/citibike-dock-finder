import { StationFinder } from "@/components/StationFinder";
import { StationList } from "@/components/StationList";
import { getNearbyStations } from "@/lib/data";
import { parseQuery } from "@/lib/query";

// Server Component: runs on the server, so the first list arrives as ready-made HTML.
// StationList is passed to StationFinder as children, which keeps the list and its cards
export default async function Home({ searchParams }: PageProps<"/">) {
  const query = parseQuery(await searchParams);
  const { stations, origin, mode, usingDefaultLocation, outsideServiceArea, updatedAt } =
    await getNearbyStations(query);

  return (
    <StationFinder
      mode={mode}
      origin={usingDefaultLocation ? undefined : origin}
      updatedAt={updatedAt}
    >
      <StationList stations={stations} mode={mode} outsideServiceArea={outsideServiceArea} />
    </StationFinder>
  );
}
