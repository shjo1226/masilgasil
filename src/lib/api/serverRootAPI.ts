import { getAppApiBaseUrl } from "../config/apiBaseUrl";

export const request = async <T>(url: string, options: RequestInit): Promise<T | undefined> => {
  return fetch(`${getAppApiBaseUrl()}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("HTTP status " + response.status);
    }
    return response.json();
  });
};

export const GET = async <T>({
  endPoint,
  options,
}: {
  endPoint: string;
  options?: RequestInit;
}) => {
  return await request<T>(endPoint, { method: "GET", ...options });
};

export const POST = async <T>({
  endPoint,
  data,
  options,
}: {
  endPoint: string;
  data?: unknown;
  options?: RequestInit;
}): Promise<T | undefined> => {
  return await request<T>(endPoint, { method: "POST", body: JSON.stringify(data), ...options });
};
