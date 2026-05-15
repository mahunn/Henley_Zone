/** True on Vercel and similar serverless hosts where the project dir is read-only. */
export function isServerlessRuntime(): boolean {
  return Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NETLIFY
  );
}

/** Local `data/orders.json` is for development only. */
export function canUseLocalOrderFileStore(): boolean {
  return !isServerlessRuntime();
}
