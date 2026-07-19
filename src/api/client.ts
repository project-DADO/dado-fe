import { ApiError, type ApiErrorResponse } from "@/types/calendar-image";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function getAuthHeaders(): HeadersInit {
  const token = import.meta.env.VITE_API_TOKEN;
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const authHeaders = getAuthHeaders();
  Object.entries(authHeaders).forEach(([key, value]) => {
    if (!headers.has(key)) headers.set(key, value);
  });

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    let message = `요청에 실패했습니다. (${response.status})`;
    try {
      const body = (await response.json()) as ApiErrorResponse;
      message = body.message ?? body.error ?? message;
    } catch {
      // ignore JSON parse failure
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}
