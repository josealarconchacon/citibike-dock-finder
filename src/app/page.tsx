import { StationFinder } from "@/components/StationFinder";
import { getNearbyStations } from "@/lib/data";
import { parseQuery } from "@/lib/query";

// Server Component: runs on the server, so the first list arrives as ready-made HTML.
export default async function Home({ searchParams }: PageProps<"/">) {
  const query = parseQuery(await searchParams);
  const initial = await getNearbyStations(query);

  return <StationFinder initial={initial} />;
}
