import { NextResponse, type NextRequest } from "next/server";
import { getNearbyStations } from "@/lib/data";
import { parseQuery } from "@/lib/query";

// GET /api/stations?lat=40.68&lon=-73.97&mode=dock
// Used by the browser to refresh the list without reloading the page.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = parseQuery({
    lat: params.get("lat"),
    lon: params.get("lon"),
    mode: params.get("mode"),
  });

  try {
    const result = await getNearbyStations(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not reach Citi Bike right now. Please try again." },
      { status: 502 },
    );
  }
}
