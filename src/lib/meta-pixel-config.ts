/** Server-safe Meta Pixel env (read in `layout.tsx`, pass as props to client). */

export function getMetaPixelEnv(): { pixelId?: string; testEventCode?: string } {
  const raw = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const test = process.env.NEXT_PUBLIC_META_PIXEL_TEST_EVENT_CODE?.trim();
  if (!raw || !/^\d{10,20}$/.test(raw)) {
    return { pixelId: undefined, testEventCode: test || undefined };
  }
  return { pixelId: raw, testEventCode: test || undefined };
}
