import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-request";
import { withAdminSessionRefresh } from "@/lib/admin-session-response";
import { saveAdminProductImage } from "@/lib/admin-image-upload";

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthorized())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const ct = request.headers.get("content-type") || "";
    if (!ct.includes("multipart/form-data")) {
      return NextResponse.json(
        { message: "Send multipart/form-data with a field named file." },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ message: "Missing file field." }, { status: 400 });
    }

    const result = await saveAdminProductImage(file);
    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: 400 });
    }

    return withAdminSessionRefresh(NextResponse.json({ url: result.url }));
  } catch {
    return NextResponse.json({ message: "Upload failed." }, { status: 500 });
  }
}
