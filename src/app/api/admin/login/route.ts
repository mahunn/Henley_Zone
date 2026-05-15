import { NextResponse } from "next/server";
import {
  createSessionValue,
  getAdminSessionSecret,
  getAdminPassword,
  getAdminUsername,
  setAdminSessionCookie
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const configuredUsername = getAdminUsername();
    const configuredPassword = getAdminPassword();
    const sessionSecret = getAdminSessionSecret();
    if (!configuredUsername || !configuredPassword || !sessionSecret) {
      return NextResponse.json(
        {
          message:
            "ADMIN_DASHBOARD_USERNAME, ADMIN_DASHBOARD_PASSWORD, and ADMIN_SESSION_SECRET must be configured."
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as { username?: string; password?: string };
    if (
      !body.username ||
      !body.password ||
      body.username !== configuredUsername ||
      body.password !== configuredPassword
    ) {
      return NextResponse.json(
        { message: "Invalid admin credentials." },
        { status: 401 }
      );
    }

    const sessionValue = createSessionValue();
    if (!sessionValue) {
      return NextResponse.json({ message: "Admin session secret is missing." }, { status: 500 });
    }

    const response = NextResponse.json({ ok: true });
    setAdminSessionCookie(response, sessionValue);
    return response;
  } catch {
    return NextResponse.json({ message: "Login failed." }, { status: 500 });
  }
}

