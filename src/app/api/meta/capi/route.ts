import { NextResponse } from "next/server";
import {
  sendMetaConversionEvent,
  parseMetaCookies,
  type SendMetaEventOptions
} from "@/lib/meta-conversions-api";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<SendMetaEventOptions> & {
      params?: Record<string, unknown>;
      fbp?: string;
      fbc?: string;
    };

    if (!body?.eventName || !body?.eventId) {
      return NextResponse.json(
        { ok: false, message: "eventName and eventId are required." },
        { status: 400 }
      );
    }

    const headers = request.headers;
    const clientIp =
      headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headers.get("x-real-ip") ||
      headers.get("cf-connecting-ip") ||
      undefined;
    const userAgent = headers.get("user-agent") || undefined;
    const cookieHeader = headers.get("cookie");
    const parsedCookies = parseMetaCookies(cookieHeader);

    const fbp = body.fbp || body.userData?.fbp || parsedCookies.fbp;
    const fbc = body.fbc || body.userData?.fbc || parsedCookies.fbc;

    const mergedUserData = {
      ...(body.userData || {}),
      clientIp: body.userData?.clientIp || clientIp,
      userAgent: body.userData?.userAgent || userAgent,
      fbp,
      fbc
    };

    // If params was passed from client instead of customData, map it
    const customData = body.customData || (body.params as Record<string, unknown>) || {};

    const result = await sendMetaConversionEvent({
      eventName: body.eventName,
      eventId: body.eventId,
      eventTime: body.eventTime,
      eventSourceUrl: body.eventSourceUrl || headers.get("referer") || undefined,
      userData: mergedUserData,
      customData,
      testEventCode: body.testEventCode
    });

    return NextResponse.json({ ok: result.ok, eventsReceived: result.eventsReceived });
  } catch (err) {
    console.error("POST /api/meta/capi error:", err);
    return NextResponse.json(
      { ok: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
