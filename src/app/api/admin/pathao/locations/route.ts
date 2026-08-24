import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-request";
import { withAdminSessionRefresh } from "@/lib/admin-session-response";
import {
  getPathaoCities,
  getPathaoZones,
  getPathaoAreas,
  isPathaoConfigured
} from "@/lib/pathao";

export async function GET(request: Request) {
  try {
    if (!(await isAdminAuthorized())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    if (!isPathaoConfigured()) {
      return NextResponse.json(
        { message: "Pathao is not configured." },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "cities";

    if (type === "cities") {
      const cities = await getPathaoCities();
      return withAdminSessionRefresh(NextResponse.json({ cities }));
    }

    if (type === "zones") {
      const cityId = Number(searchParams.get("city_id"));
      if (!cityId) {
        return NextResponse.json({ message: "city_id is required for zones." }, { status: 400 });
      }
      const zones = await getPathaoZones(cityId);
      return withAdminSessionRefresh(NextResponse.json({ zones }));
    }

    if (type === "areas") {
      const zoneId = Number(searchParams.get("zone_id"));
      if (!zoneId) {
        return NextResponse.json({ message: "zone_id is required for areas." }, { status: 400 });
      }
      const areas = await getPathaoAreas(zoneId);
      return withAdminSessionRefresh(NextResponse.json({ areas }));
    }

    return NextResponse.json({ message: "Invalid location query type." }, { status: 400 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to fetch locations.";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
}
