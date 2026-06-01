export const getAppApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "/call";
  }

  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredSiteUrl) {
    return `${configuredSiteUrl.replace(/\/$/, "")}/call`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/call`;
  }

  return "http://localhost:3000/call";
};
